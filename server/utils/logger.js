const LOG_LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const { performance } = require("perf_hooks");

// ---- Internal State ----
let logBuffer = [];
let startTime = performance.now();

// ---- Config ----
const getLevel = () => process.env.LOG_LEVEL || "debug";

// ---- Helpers ----
const shouldLog = (level) => {
	const current = getLevel();
	return (LOG_LEVELS[level] ?? 0) >= (LOG_LEVELS[current] ?? 0);
};

const formatArgs = (args) => {
	if (args.length === 1) return args[0];
	return args.map(a => (typeof a === "object" ? JSON.stringify(a) : a)).join(" ");
};

const pushLog = (level, args) => {
	const entry = {
		level,
		ts: Date.now(),
		uptimeMs: performance.now() - startTime,
		message: formatArgs(args),
		raw: args, // optional, keep original data
	};

	logBuffer.push(entry);

	if (shouldLog(level)) {
		const prefix = `[${level.toUpperCase()}]`;
		if (level === "error") console.error(prefix, ...args);
		else if (level === "warn") console.warn(prefix, ...args);
		else if (level === "info") console.info(prefix, ...args);
		else console.log(prefix, ...args);
	}
};

// ---- Public API ----
const log = (...args) => pushLog("debug", args);
const info = (...args) => pushLog("info", args);
const warn = (...args) => pushLog("warn", args);
const error = (...args) => pushLog("error", args);

// ---- Retrieval ----
const getLogs = (minLevel = getLevel()) => {
	return logBuffer.filter(
		(entry) =>
			(LOG_LEVELS[entry.level] ?? 0) >=
			(LOG_LEVELS[minLevel] ?? 0)
	);
};

// ---- Optional Utilities ----
const clearLogs = () => {
	logBuffer = [];
	startTime = performance.now();
};

const getSummary = () => {
	const summary = {
		total: logBuffer.length,
		byLevel: {},
		durationMs: performance.now() - startTime,
	};

	for (const lvl in LOG_LEVELS) {
		summary.byLevel[lvl] = logBuffer.filter(l => l.level === lvl).length;
	}

	return summary;
};

module.exports = {
	log,
	info,
	warn,
	error,
	getLogs,
	clearLogs,
	getSummary,
};

module.exports = { log, info, warn, error };
