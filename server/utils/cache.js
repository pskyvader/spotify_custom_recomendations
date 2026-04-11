/**
 * Bounded cache for memory-efficient caching
 * Replaces the old NodeCache with size and key limits
 */

const boundedCache = require("./boundedCache");

// Maintain backward compatibility with old cache API
const cache = {
    get: (key) => boundedCache.get(key),
    set: (key, value, ttl) => boundedCache.set(key, value, ttl),
    del: (key) => boundedCache.delete(key),
    delete: (key) => boundedCache.delete(key),
    clear: () => boundedCache.clear(),
    getStats: () => boundedCache.getStats(),
};

module.exports = cache;

