const { User } = require("../database");
const { refreshCookie } = require("../spotifyapi/user");
const {
	log,
	info,
	warn,
	error,
	getLogs,
	clearLogs,
} = require("../utils/logger");
const { getHourlyTasks, getDailyTasks } = require("../tasks");
const { taskQueue } = require("../utils/taskQueue");

// ---- Config ----
const CONFIG = {
	enableLimits: process.env.ENABLE_LIMITS === "true",
	enableHourly: process.env.ENABLE_HOURLY !== "false",
	enableDaily: process.env.ENABLE_DAILY !== "false",
};

const TIME = {
	hour: 3600000,
	tenMinutes: 600000,
	day: 86400000,
};

let lastTaskRun = Date.now() - TIME.day;

// Store ongoing/completed task runs
const tasks_ongoingRun = {
	id: null,
	startedAt: null,
	status: "idle", // idle, running, completed
	hourlyCompleted: 0,
	dailyCompleted: 0,
	totalTimeMs: 0,
	results: {},
};

// ---- Helpers ----
const shouldRun = (lastRun, interval) =>
	!CONFIG.enableLimits || lastRun < Date.now() - interval + TIME.tenMinutes;

const now = () => Date.now();

// ---- User Preparation (BATCHED - NOT ALL PARALLEL) ----
const getAvailableUsers = async (limit = 50, offset = 0) => {
	const start = now();

	// Use LIMIT/OFFSET to avoid loading all users at once
	const users = await User.findAll({
		limit: limit,
		offset: offset,
		raw: false,
	});

	const result = {
		hourly: [],
		daily: [],
		error: false,
	};

	const processed = await Promise.all(
		users.map(async (user) => {
			const userStart = now();

			log("Processing user", { userId: user.id });

			// ---- Token refresh (parallel per batch) ----
			if (user.expiration < now() + TIME.tenMinutes) {
				const t = now();

				const res = await refreshCookie(user);

				info("Token refresh attempted", {
					userId: user.id,
					ms: now() - t,
					error: res?.error ?? null,
				});

				if (res?.error) {
					warn("Token refresh failed", { userId: user.id });
					return null;
				}

				user.access_token = res.access_token;
				user.expiration = res.expiration;
			}

			const entry = {
				user,
				hourly: shouldRun(user.last_modified_hourly, TIME.hour),
				daily: shouldRun(user.last_modified_daily, TIME.day),
				ms: now() - userStart,
			};

			log("User processed", {
				userId: user.id,
				ms: entry.ms,
			});

			return entry;
		})
	);

	// ---- Aggregate ----
	for (const entry of processed) {
		if (!entry) continue;

		if (entry.hourly) result.hourly.push(entry.user);
		if (entry.daily) result.daily.push(entry.user);
	}

	info("User selection completed (batch)", {
		batchLimit: limit,
		offset: offset,
		validUsers: processed.filter(Boolean).length,
		hourlyEligible: result.hourly.length,
		dailyEligible: result.daily.length,
		ms: now() - start,
	});

	return result;
};

// ---- Task Runner (QUEUED - NOT ALL PARALLEL) ----
const runTasksQueued = async (taskFunctions, label) => {
	const batchStart = now();

	if (!taskFunctions.length) {
		info(`No ${label} tasks available`);
		return { error: false, totalMs: 0, completed: 0 };
	}

	let completed = 0;
	let hasError = false;

	// Process tasks through queue
	for (let i = 0; i < taskFunctions.length; i++) {
		const taskFn = taskFunctions[i];
		const t = now();

		try {
			const res = await taskQueue.enqueue(taskFn, `${label}-task-${i + 1}/${taskFunctions.length}`);

			if (res?.error) {
				hasError = true;
			}
			completed++;

			info(`${label} task ${i + 1}/${taskFunctions.length} completed`, {
				ms: now() - t,
				error: res?.error ?? null,
			});
		} catch (err) {
			hasError = true;
			warn(`${label} task ${i + 1} failed`, { error: err.message });
		}
	}

	const batchMs = now() - batchStart;

	info(`${label} batch completed`, {
		count: taskFunctions.length,
		completed,
		error: hasError,
		totalMs: batchMs,
	});

	return { error: hasError, totalMs: batchMs, completed };
};

// ---- Main Entry (BATCHED USER PROCESSING) ----
const automaticTasks = async () => {
	clearLogs();

	const globalStart = now();

	// ---- Global rate limit ----
	if (CONFIG.enableLimits && !shouldRun(lastTaskRun, TIME.hour)) {
		warn("Global rate limit hit", {
			lastTaskRun,
			now: now(),
			nextAllowedRun: lastTaskRun + TIME.hour,
		});

		return {
			error: true,
			logs: getLogs(),
		};
	}

	// ---- Fetch users in batches ----
	const usersFetchStart = now();
	const users = await getAvailableUsers(50, 0); // Batch 50 users at a time
	const usersFetchMs = now() - usersFetchStart;

	let overallError = users.error;

	const taskFunctions = [];
	let hourlyMs = 0;
	let dailyMs = 0;
	let hourlyCompleted = 0;
	let dailyCompleted = 0;

	if (CONFIG.enableHourly && users.hourly.length > 0) {
		const hourlyTasks = getHourlyTasks(users.hourly);
		const hourlyResult = await runTasksQueued(hourlyTasks, "Hourly");
		hourlyMs = hourlyResult.totalMs;
		hourlyCompleted = hourlyResult.completed;
		overallError ||= hourlyResult.error;
	}

	if (CONFIG.enableDaily && users.daily.length > 0) {
		const dailyTasks = getDailyTasks(users.daily);
		const dailyResult = await runTasksQueued(dailyTasks, "Daily");
		dailyMs = dailyResult.totalMs;
		dailyCompleted = dailyResult.completed;
		overallError ||= dailyResult.error;
	}

	lastTaskRun = now();

	const totalMs = now() - globalStart;

	info("All tasks finished", {
		totalMs,
		usersFetchMs,
		hourlyTasksMs: hourlyMs,
		dailyTasksMs: dailyMs,
		hourlyCompleted,
		dailyCompleted,
		otherMs: totalMs - usersFetchMs - hourlyMs - dailyMs,
	});

	// Update task run status
	tasks_ongoingRun.status = "completed";
	tasks_ongoingRun.totalTimeMs = totalMs;

	return {
		error: overallError,
		logs: getLogs(),
		timing: {
			totalMs,
			usersFetchMs,
			hourlyTasksMs: hourlyMs,
			dailyTasksMs: dailyMs,
			hourlyCompleted,
			dailyCompleted,
		},
	};
};

// Run tasks asynchronously without blocking
const runTasksAsync = async () => {
	// If another run is in progress, skip
	if (tasks_ongoingRun.status === "running") {
		warn("Tasks already running, skipping");
		return tasks_ongoingRun;
	}

	tasks_ongoingRun.status = "running";
	tasks_ongoingRun.startedAt = now();
	tasks_ongoingRun.id = Date.now();

	// Run async without awaiting
	automaticTasks()
		.then((result) => {
			tasks_ongoingRun.results = result;
			tasks_ongoingRun.status = "completed";
			info("Async tasks completed", result.timing);
		})
		.catch((err) => {
			error("Async tasks failed", { error: err.message });
			tasks_ongoingRun.status = "error";
			tasks_ongoingRun.results = { error: true, message: err.message };
		});

	return tasks_ongoingRun;
};

module.exports = { automaticTasks, runTasksAsync, tasks_ongoingRun };
