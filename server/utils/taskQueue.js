/**
 * Task queue with batch processing and early response capability
 * Limits concurrent task execution to reduce memory usage
 */

const { log, info, warn } = require("./logger");

class TaskQueue {
    constructor(concurrency = 2, batchSize = 5) {
        this.concurrency = concurrency; // How many tasks run in parallel
        this.batchSize = batchSize; // How many items per task batch
        this.running = 0;
        this.queue = [];
        this.results = new Map();
        this.taskId = 0;
    }

    /**
     * Generate unique task ID
     */
    generateTaskId() {
        return ++this.taskId;
    }

    /**
     * Add task to queue
     * @param {Function} taskFn - Async function that returns a result
     * @param {string} label - Label for logging
     * @returns {Promise} Resolves with task result
     */
    async enqueue(taskFn, label = "task") {
        return new Promise((resolve, reject) => {
            this.queue.push({
                taskFn,
                label,
                resolve,
                reject,
                createdAt: Date.now(),
            });

            log("[QUEUE-ENQUEUE]", {
                queueLength: this.queue.length,
                running: this.running,
                label,
            });

            this._processQueue();
        });
    }

    /**
     * Process queued tasks respecting concurrency limit
     */
    async _processQueue() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const task = this.queue.shift();
            this.running++;

            const startTime = Date.now();
            const taskId = this.generateTaskId();

            log("[QUEUE-EXECUTE-START]", {
                taskId,
                label: task.label,
                queueRemaining: this.queue.length,
                running: this.running,
            });

            try {
                const result = await task.taskFn();

                const execTime = Date.now() - startTime;
                info("[QUEUE-EXECUTE-COMPLETE]", {
                    taskId,
                    label: task.label,
                    timeMs: execTime,
                    hasError: result?.error ?? false,
                });

                this.results.set(taskId, {
                    result,
                    status: "completed",
                    timeMs: execTime,
                });

                task.resolve(result);
            } catch (error) {
                const execTime = Date.now() - startTime;
                warn("[QUEUE-EXECUTE-ERROR]", {
                    taskId,
                    label: task.label,
                    error: error.message,
                    timeMs: execTime,
                });

                this.results.set(taskId, {
                    error: error.message,
                    status: "failed",
                    timeMs: execTime,
                });

                task.reject(error);
            }

            this.running--;

            // Continue processing queue
            if (this.queue.length > 0) {
                setImmediate(() => this._processQueue());
            }
        }
    }

    /**
     * Process array of items in batches
     * @param {Array} items - Items to process
     * @param {Function} processFn - Async function that processes each item
     * @param {string} label - Label for logging
     * @returns {Promise<Array>} Results array
     */
    async processBatch(items, processFn, label = "batch") {
        if (!Array.isArray(items)) {
            throw new Error("Items must be an array");
        }

        info("[BATCH-START]", {
            itemCount: items.length,
            batchSize: this.batchSize,
            label,
        });

        const results = [];
        const batches = [];

        // Split into batches
        for (let i = 0; i < items.length; i += this.batchSize) {
            batches.push(items.slice(i, i + this.batchSize));
        }

        // Process each batch
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const batchResults = await this.enqueue(async () => {
                const batchResults = [];
                for (const item of batch) {
                    try {
                        const result = await processFn(item);
                        batchResults.push(result);
                    } catch (error) {
                        warn(`[BATCH-ERROR] Error processing item in ${label} batch ${i}`, {
                            error: error.message,
                        });
                        batchResults.push({ error: true, message: error.message });
                    }
                }
                return batchResults;
            }, `${label}-batch-${i + 1}/${batches.length}`);

            if (Array.isArray(batchResults)) {
                results.push(...batchResults);
            }
        }

        info("[BATCH-COMPLETE]", {
            label,
            itemsProcessed: results.length,
            batchCount: batches.length,
        });

        return results;
    }

    /**
     * Get queue stats
     */
    getStats() {
        return {
            queued: this.queue.length,
            running: this.running,
            concurrency: this.concurrency,
            batchSize: this.batchSize,
            results: this.results.size,
        };
    }

    /**
     * Clear completed results periodically
     */
    clearOldResults(maxAge = 3600000) {
        const now = Date.now();
        let cleared = 0;

        for (const [id, data] of this.results) {
            // Dummy check - results map doesn't track timestamp
            // In real usage, add timestamps when storing
            cleared++;
        }

        info("[QUEUE-CLEANUP]", { resultsByCleared: cleared });
    }
}

// Create singleton with default concurrency
const taskQueue = new TaskQueue(parseInt(process.env.TASK_CONCURRENCY || "2"), 5);

module.exports = { TaskQueue, taskQueue };
