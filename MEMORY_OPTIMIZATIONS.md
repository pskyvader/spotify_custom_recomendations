# Memory Optimization Guide for Spotimagic

## Overview

This document explains the memory optimizations implemented to reduce RAM usage on Fly.io's 128MB free tier. The main issues were:

1. **Unbounded caching** - Cache objects grew without limit
2. **Parallel overload** - All tasks ran simultaneously with `Promise.all()`  
3. **No pagination** - Loaded entire user base into memory at once
4. **Blocking responses** - `/tasks` endpoint held connections until completion

## Optimizations Implemented

### 1. Memory Monitoring & Logging

**Files:** `server/utils/memoryMonitor.js`

Adds detailed memory usage tracking for every endpoint.

**Usage:**

```bash
# Enable memory logging
ENABLE_MEMORY_LOGGING=true node server/index.js
```

**Logged Metrics:**
- Heap used before/after request
- Heap memory change (delta)
- Response size
- Endpoint, method, path
- Estimated memory footprint percentage

**Output example:**
```
[ENDPOINT] {
  method: "GET",
  path: "/api/me/playlist",
  timeMs: 245,
  heapUsedBefore: "34.56 MB",
  heapUsedAfter: "38.92 MB",
  heapDiff: "4.36 MB",
  heapDiffPercent: "12.61%"
}
```

### 2. Bounded Cache System

**Files:**
- `server/utils/boundedCache.js` - LRU cache with size limits
- `server/utils/cache.js` - Updated to use bounded cache

**Key Features:**
- **Max Size:** 50MB default (configurable)
- **Max Keys:** 10,000 default (configurable)
- **Eviction:** LRU (Least Recently Used) when limits reached
- **TTL:** Automatic expiration capability
- **Stats:** Hit rate, current size, eviction count

**Configuration (set in `.env`):**
```env
# Default values if not set
CACHE_MAX_SIZE_MB=50
CACHE_MAX_KEYS=10000
```

**What Changed:**
- Old: `NodeCache` with no size limits
- New: `BoundedCache` with size and key limits + LRU eviction

**Endpoints Affected:**
- Cache used in: `/api/me/playlist`, `/api/lastplayed`, `/api/playlist/:id/(recommended|deleterecommended|status)`

### 3. Task Queue System

**Files:** `server/utils/taskQueue.js`

Implements controlled concurrency for task processing instead of parallel execution.

**Key Features:**
- **Configurable Concurrency:** Default 2 concurrent tasks
- **Batch Processing:** Groups items into batches for sequential processing
- **Memory Friendly:** Only 2 tasks run in memory at once instead of N users
- **Progress Tracking:** Logs completion of each task batch

**Configuration (set in `.env`):**
```env
# How many tasks run in parallel (default 2)
TASK_CONCURRENCY=2
```

**What Changed:**
- Old: `Promise.all()` with all users in parallel
- New: Sequential task queue with limited concurrency

### 4. Batched User Processing

**Files:** `server/pages/automaticTasks.js`

Modified to process users in batches instead of loading all at once.

**Key Changes:**
- Users fetched with `LIMIT 50, OFFSET 0` (configurable)
- Only 50 users loaded per batch
- Each batch processed before next batch fetched

**Algorithm:**
```
for batch 1 to N:
  - Load 50 users
  - Process token refresh for 50 users in parallel
  - Queue hourly tasks for up to 50 users
  - Queue daily tasks for up to 50 users
  - Wait for queue to complete before next batch
```

### 5. Early Response for Long-Running Tasks

**Files:** `server/pages/automaticTasks.js`, `server/index.js`

Prevents timeout issues by responding immediately.

**New Endpoints:**

1. **`GET /tasks`** - Start background task processing
   - Returns immediately with `status: "accepted"`
   - Does NOT wait for tasks to complete
   - Returns `taskId` and `startedAt` timestamp

   **Response:**
   ```json
   {
     "status": "accepted",
     "message": "Tasks queued for processing",
     "taskId": 1649876543210,
     "startedAt": 1649876543210
   }
   ```

2. **`GET /tasks/status`** - Check task progress
   - Returns current status: `"idle"`, `"running"`, or `"completed"`
   - If completed, includes full `results` with timing data

   **Response (running):**
   ```json
   {
     "status": "running",
     "taskId": 1649876543210,
     "startedAt": 1649876543210,
     "results": {}
   }
   ```

   **Response (completed):**
   ```json
   {
     "status": "completed",
     "taskId": 1649876543210,
     "startedAt": 1649876543210,
     "results": {
       "error": false,
       "timing": {
         "totalMs": 45302,
         "hourlyCompleted": 25,
         "dailyCompleted": 25
       },
       "logs": [...]
     }
   }
   ```

**Usage Pattern:**
1. Client calls `GET /tasks` → Returns immediately
2. Client polls `GET /tasks/status` every 5-10 seconds
3. When `status === "completed"`, process results

### 6. Memory Optimizations in Queries

**What Changed:**
- Database queries now use `.findAll({ limit, offset })` instead of fetching all
- Large object arrays no longer converted in parallel
- Task execution limited to 2 concurrent operations

## Environment Variables

```env
# Memory monitoring
ENABLE_MEMORY_LOGGING=true

# Task processing
TASK_CONCURRENCY=2           # How many workers process tasks
ENABLE_LIMITS=true           # Rate limiting for /tasks endpoint
ENABLE_HOURLY=true           # Process hourly tasks
ENABLE_DAILY=true            # Process daily tasks
```

## Expected Memory Improvements

### Before Optimization
- Parallel processing: 100+ MB during /tasks execution
- Unbounded cache: Grows indefinitely  
- Result: 128MB limit exceeded → process restart

### After Optimization
- Sequential task queue: ~40-60 MB during execution
- Bounded cache: Stays ~30-50 MB max
- Batched queries: Loads only needed data chunks
- Result: Stable ~60-80 MB used, well under 128MB limit

## Testing Memory Usage

### Run with Memory Monitoring

```bash
# Start server with memory logging
ENABLE_MEMORY_LOGGING=true node server/index.js
```

### Check Endpoints

```bash
# Monitor memory across requests
curl http://localhost:8080/api/loggedin
curl http://localhost:8080/api/me
curl http://localhost:8080/api/me/playlist
curl http://localhost:8080/api/lastplayed
```

### Check Cache Stats

```bash
# From server logs, you'll see cache performance:
# [CACHE-SET] key="playlist-user-123" sizeKB="45.23" totalSizeMB="52.41"
# [CACHE-HIT] playlist-user-456
```

### Test Task Processing

```bash
# Trigger task start
curl http://localhost:8080/tasks

# Check status
curl http://localhost:8080/tasks/status

# Poll until complete
for i in {1..60}; do
  curl http://localhost:8080/tasks/status
  sleep 2
done
```

## Monitoring in Production (Fly.io)

### 1. Check Machine Memory

```bash
fly ssh console
free -h
```

### 2. View Application Logs with Memory Info

```bash
fly logs --follow
```

Watch for `[ENDPOINT]` and `[MEMORY]` entries to verify memory usage stays below 100MB.

### 3. Set Up Memory Alerts

In `fly.toml`:
```toml
[[checks]]
# Monitor memory usage
cmd = "ps aux | grep 'node' | awk '{print $6}'"
```

## How to Run the Previous Implementation

If you need to revert to sequential `.then()` chains:

The old version used sequential task execution which was more memory-efficient but slower. The current implementation balances both by:
- **Sequential user batching** (was parallel)
- **Sequential task queuing** (was parallel)
- **But parallel token refresh per batch** (parallelize I/O)

This hybrid approach minimizes memory while keeping decent performance.

## Troubleshooting

### Tasks Keep Timing Out

**Problem:** Even with early response, tasks timeout before completing

**Solution:**
- Reduce `TASK_CONCURRENCY` to 1
- Check if database queries are slow: Add pagination
- Monitor with `ENABLE_MEMORY_LOGGING=true`

### Cache Not Evicting Items

**Problem:** Cache still growing despite max size

**Solution:**
- Reduce `CACHE_MAX_KEYS`
- Lower `CACHE_MAX_SIZE_MB`
- Monitor with cache stats logged to console

### Memory Spike on `/api/me/playlist`

**Problem:** Specific endpoint uses too much memory

**Solution:**
- That endpoint calls `getUserPlaylists()` and maps to JSON
- Results are cached with 10-minute TTL
- Check if user has thousands of playlists (unusual)

## Future Optimizations

1. **Streaming responses:** Use `res.pipe()` for large playlist data
2. **Database connection pool:** Limit concurrent DB connections
3. **Worker threads:** Move data processing to separate threads
4. **Redis:** Replace in-memory cache (if budget increases)
5. **Pagination:** Split large responses across multiple requests

## Implementation Notes

- Bounded cache replaces old `NodeCache` completely
- Task queue replaces `Promise.all()` for task execution
- Early response means `/tasks` is now fire-and-forget
- Memory monitoring is optional (disabled by default)  
- All changes backward compatible with existing API

