const LOG_LEVELS = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const getLevel = () => process.env.LOG_LEVEL;

const shouldLog = (level) => {
	const current = getLevel();
	return (LOG_LEVELS[level] || 0) >= (LOG_LEVELS[current] || 0);
};

const log = (...args) => {
	if (shouldLog("debug")) {
		console.log("[DEBUG]", ...args);
	}
};

const info = (...args) => {
	if (shouldLog("info")) {
		console.info("[INFO]", ...args);
	}
};

const warn = (...args) => {
	if (shouldLog("warn")) {
		console.warn("[WARN]", ...args);
	}
};

const error = (...args) => {
	if (shouldLog("error")) {
		console.error("[ERROR]", ...args);
	}
};

module.exports = { log, info, warn, error };
