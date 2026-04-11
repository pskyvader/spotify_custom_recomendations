/**
 * Memory monitoring utility for tracking memory usage across endpoints
 */

const { log, info } = require("./logger");

// Format bytes to human readable
const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

// Get current memory usage
const getMemoryUsage = () => {
    return process.memoryUsage();
};

// Log memory snapshot with label
const logMemorySnapshot = (label, customData = {}) => {
    const memory = getMemoryUsage();
    info(`[MEMORY] ${label}`, {
        heapUsed: formatBytes(memory.heapUsed),
        heapTotal: formatBytes(memory.heapTotal),
        external: formatBytes(memory.external),
        rss: formatBytes(memory.rss),
        ...customData,
    });
};

// Middleware to log memory for each endpoint
const memoryLoggingMiddleware = (req, res, next) => {
    const startMemory = getMemoryUsage();
    const startTime = Date.now();

    // Capture original send/json methods
    const originalSend = res.send;
    const originalJson = res.json;

    const cleanup = (size) => {
        const endMemory = getMemoryUsage();
        const timeDiff = Date.now() - startTime;
        const heapDiff = endMemory.heapUsed - startMemory.heapUsed;

        info("[ENDPOINT]", {
            method: req.method,
            path: req.originalUrl,
            timeMs: timeDiff,
            responseSize: formatBytes(size),
            heapUsedBefore: formatBytes(startMemory.heapUsed),
            heapUsedAfter: formatBytes(endMemory.heapUsed),
            heapDiff: formatBytes(heapDiff),
            heapDiffPercent: ((heapDiff / startMemory.heapUsed) * 100).toFixed(2) + "%",
        });
    };

    // Override send
    res.send = function (data) {
        if (data) {
            cleanup(Buffer.byteLength(data, "utf8"));
        }
        return originalSend.call(this, data);
    };

    // Override json
    res.json = function (data) {
        if (data) {
            cleanup(Buffer.byteLength(JSON.stringify(data), "utf8"));
        }
        return originalJson.call(this, data);
    };

    next();
};

// Force garbage collection and log
const forceGarbageCollection = () => {
    if (global.gc) {
        global.gc();
        logMemorySnapshot("[GC] After garbage collection");
    } else {
        log("Garbage collection not enabled. Run node with --expose-gc flag");
    }
};

module.exports = {
    formatBytes,
    getMemoryUsage,
    logMemorySnapshot,
    memoryLoggingMiddleware,
    forceGarbageCollection,
};
