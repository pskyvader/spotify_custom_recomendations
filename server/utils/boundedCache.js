/**
 * Bounded cache with size limits and LRU eviction
 */

const { log, warn } = require("./logger");

class BoundedCache {
    constructor(maxSize = 50 * 1024 * 1024, maxKeys = 10000) {
        this.maxSize = maxSize; // 50MB default
        this.maxKeys = maxKeys; // 10k keys default
        this.cache = new Map();
        this.currentSize = 0;
        this.stats = {
            hits: 0,
            misses: 0,
            evictions: 0,
        };
    }

    _estimateSize(value) {
        // Rough estimation of object size
        if (typeof value === "string") {
            return value.length * 2; // UTF-16 encoding
        }
        if (Array.isArray(value) || typeof value === "object") {
            return JSON.stringify(value).length * 2;
        }
        return 100; // default estimate
    }

    set(key, value, ttl = 600) {
        const size = this._estimateSize(value);

        // Reject if single item is too large
        if (size > this.maxSize / 10) {
            warn("[CACHE] Item too large, not caching", {
                key,
                size: (size / 1024 / 1024).toFixed(2) + "MB",
                maxAllowed: ((this.maxSize / 10) / 1024 / 1024).toFixed(2) + "MB",
            });
            return;
        }

        // Remove old value if exists
        if (this.cache.has(key)) {
            const oldSize = this._estimateSize(this.cache.get(key).value);
            this.currentSize -= oldSize;
        }

        // Evict LRU items if needed
        while (this.currentSize + size > this.maxSize || this.cache.size >= this.maxKeys) {
            const firstKey = this.cache.keys().next().value;
            if (!firstKey) break;

            const oldSize = this._estimateSize(this.cache.get(firstKey).value);
            this.cache.delete(firstKey);
            this.currentSize -= oldSize;
            this.stats.evictions++;
        }

        // Set expiry timeout
        let timeout = null;
        if (ttl) {
            timeout = setTimeout(() => {
                this.delete(key);
            }, ttl * 1000);
        }

        this.cache.set(key, {
            value,
            timeout,
            createdAt: Date.now(),
        });
        this.currentSize += size;

        log("[CACHE-SET]", {
            key,
            sizeKB: (size / 1024).toFixed(2),
            totalSizeMB: (this.currentSize / 1024 / 1024).toFixed(2),
            keys: this.cache.size,
        });
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) {
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        // Move to end (newest)
        this.cache.delete(key);
        this.cache.set(key, item);

        log("[CACHE-HIT] " + key);
        return item.value;
    }

    delete(key) {
        const item = this.cache.get(key);
        if (item) {
            if (item.timeout) clearTimeout(item.timeout);
            const size = this._estimateSize(item.value);
            this.currentSize -= size;
            this.cache.delete(key);
        }
    }

    clear() {
        for (const [, item] of this.cache) {
            if (item.timeout) clearTimeout(item.timeout);
        }
        this.cache.clear();
        this.currentSize = 0;
    }

    getStats() {
        const hitRate =
            this.stats.hits + this.stats.misses > 0
                ? ((this.stats.hits / (this.stats.hits + this.stats.misses)) * 100).toFixed(2)
                : 0;

        return {
            ...this.stats,
            hitRate: hitRate + "%",
            currentSizeMB: (this.currentSize / 1024 / 1024).toFixed(2),
            keysCount: this.cache.size,
        };
    }
}

// Create singleton instance
const boundedCache = new BoundedCache();

module.exports = boundedCache;
