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

// ---- Helpers ----
const shouldRun = (lastRun, interval) =>
	!CONFIG.enableLimits || lastRun < Date.now() - interval + TIME.tenMinutes;

const now = () => Date.now();

// ---- User Preparation (FULL PARALLEL) ----
const getAvailableUsers = async () => {
	const start = now();

	const users = await User.findAll();

	const result = {
		hourly: [],
		daily: [],
		error: false,
	};

	const processed = await Promise.all(
		users.map(async (user) => {
			const userStart = now();

			log("Processing user", { userId: user.id });

			// ---- Token refresh (parallel) ----
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

	info("User selection completed", {
		totalUsers: users.length,
		validUsers: processed.filter(Boolean).length,
		hourlyEligible: result.hourly.length,
		dailyEligible: result.daily.length,
		ms: now() - start,
	});

	return result;
};

// ---- Task Runner (PARALLEL PER TASK) ----
const runTasks = async (tasks, label) => {
	const batchStart = now();

	if (!tasks.length) {
		info(`No ${label} tasks available`);
		return { error: false };
	}

	const wrappedTasks = tasks.map((task, index) => (async () => {
		const t = now();

		const res = await task();

		info(`${label} task completed`, {
			index,
			ms: now() - t,
			error: res?.error ?? null,
		});

		return res;
	})());

	const results = await Promise.all(wrappedTasks);

	const hasError = results.some((r) => r?.error);

	info(`${label} batch completed`, {
		count: tasks.length,
		error: hasError,
		totalMs: now() - batchStart,
	});

	return { error: hasError };
};

// ---- Main Entry ----
const automaticTasks = async () => {
	clearLogs();

	const globalStart = now();

	// ---- Global rate limit ----
	if (CONFIG.enableLimits && !shouldRun(lastTaskRun, TIME.hour)) {
		warn("Global rate limit hit");

		return {
			error: true,
			logs: getLogs(),
		};
	}

	const users = await getAvailableUsers();

	let overallError = users.error;

	const executions = [];

	if (CONFIG.enableHourly) {
		executions.push(
			runTasks(getHourlyTasks(users.hourly), "Hourly")
		);
	}

	if (CONFIG.enableDaily) {
		executions.push(
			runTasks(getDailyTasks(users.daily), "Daily")
		);
	}

	const results = await Promise.all(executions);

	for (const r of results) {
		overallError ||= r.error;
	}

	lastTaskRun = now();

	info("All tasks finished", {
		totalMs: now() - globalStart,
	});

	return {
		error: overallError,
		logs: getLogs(),
	};
};

module.exports = { automaticTasks };
