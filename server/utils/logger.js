const LOG_LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

// ---- Internal State ----
let logBuffer = [];
let startTime = Date.now();

// ---- Config ----
const getLevel = () => process.env.LOG_LEVEL || "debug";

// ---- Helpers ----
const shouldLog = (level) => {
	const current = getLevel();
	return (LOG_LEVELS[level] ?? 0) >= (LOG_LEVELS[current] ?? 0);
};

const formatArgs = (args) => {
	if (args.length === 1) return args[0];
	return args.map(a =>
		typeof a === "object" ? JSON.stringify(a) : a
	).join(" ");
};

const now = () => Date.now();

// ---- Core ----
const pushLog = (level, args) => {
	const entry = {
		level,
		ts: now(),
		uptimeMs: now() - startTime,
		message: formatArgs(args),
		raw: args,
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

// ---- Utilities ----
const clearLogs = () => {
	logBuffer = [];
	startTime = now();
};

const getSummary = () => {
	const summary = {
		total: logBuffer.length,
		byLevel: {},
		durationMs: now() - startTime,
	};

	for (const lvl in LOG_LEVELS) {
		summary.byLevel[lvl] = logBuffer.filter(
			(l) => l.level === lvl
		).length;
	}

	return summary;
};

// ---- Export (FIXED) ----
module.exports = {
	log,
	info,
	warn,
	error,
	getLogs,
	clearLogs,
	getSummary,
};
