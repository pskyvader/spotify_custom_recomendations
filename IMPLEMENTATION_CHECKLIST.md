# Implementation Checklist

Verify all memory optimizations are properly installed and working.

## ✅ Files Created

Check that these new files exist:

```bash
server/utils/memoryMonitor.js      # Memory tracking utility
server/utils/boundedCache.js        # LRU cache with size limits
server/utils/taskQueue.js           # Controlled concurrency task queue

MEMORY_OPTIMIZATIONS.md             # Technical documentation
MIGRATION_GUIDE.md                  # How to use the changes
MEMORY_TRADE_OFFS.md                # Understanding the trade-offs
IMPLEMENTATION_CHECKLIST.md         # This file
```

Run:
```bash
ls -la server/utils/memoryMonitor.js
ls -la server/utils/boundedCache.js
ls -la server/utils/taskQueue.js
```

## ✅ Files Modified

These files were updated to use the new systems:

```bash
server/index.js                 # Added memory monitoring + early response /tasks
server/pages/index.js          # Exports runTasksAsync + tasks_ongoingRun
server/pages/automaticTasks.js # Uses taskQueue instead of Promise.all()
server/routes/api.js           # Uses boundedCache instead of object cache
server/routes/api.playlist.js  # Uses boundedCache for playlist cache
server/utils/index.js          # Exports new utilities
server/utils/cache.js          # Now uses boundedCache internally
```

Verify these files have the changes (check for logs or imports):
```bash
grep -n "memoryLoggingMiddleware" server/index.js
grep -n "taskQueue" server/pages/automaticTasks.js
grep -n "boundedCache" server/routes/api.js
```

## ✅ Environment Configuration

Add to your `.env` file (or `fly.toml` env):

```env
# Memory optimizations
ENABLE_MEMORY_LOGGING=false         # Set to true initially to debug
TASK_CONCURRENCY=2                  # How many tasks run in parallel
CACHE_MAX_SIZE_MB=50                # Max cache size
CACHE_MAX_KEYS=10000                # Max cache entries

# Task scheduling
ENABLE_LIMITS=true
ENABLE_HOURLY=true
ENABLE_DAILY=true
```

## ✅ Testing Steps

### 1. Start the Server

```bash
# Development (with memory logging)
ENABLE_MEMORY_LOGGING=true node server/index.js

# Or production mode
node server/index.js
```

Look for:
- ✅ No errors on startup
- ✅ Server listening on port 8080
- ✅ Database connection established

### 2. Test Endpoints

**Memory Monitoring (if enabled):**
```bash
curl http://localhost:8080/api/loggedin
# Should see in console: [ENDPOINT] {method: "GET", path: "/api/loggedin", heapDiff: "..." }
```

**Standard Endpoints:**
```bash
curl http://localhost:8080/api/me
curl http://localhost:8080/api/me/playlist
```

Both should return valid JSON (no errors).

### 3. Test Early Response for Tasks

**Old behavior would block:** This should NOW respond immediately.

```bash
time curl http://localhost:8080/tasks
```

Expected output:
```json
{
  "status": "accepted",
  "message": "Tasks queued for processing",
  "taskId": 1234567890,
  "startedAt": 1234567890
}
```

**Important:** Should return in < 100ms, NOT 30+ seconds.

### 4. Test Task Status Endpoint

```bash
curl http://localhost:8080/tasks/status
```

Expected output (while running):
```json
{
  "status": "running",
  "taskId": 1234567890,
  "startedAt": 1234567890,
  "results": {}
}
```

Or (after complete):
```json
{
  "status": "completed",
  "taskId": 1234567890,
  "startedAt": 1234567890,
  "results": {
    "error": false,
    "timing": {
      "totalMs": 25000,
      "hourlyCompleted": 15,
      "dailyCompleted": 10
    }
  }
}
```

### 5. Check Cache System

Enable logging and watch for cache entries:

```bash
ENABLE_MEMORY_LOGGING=true node server/index.js
```

Make some requests:
```bash
curl http://localhost:8080/api/me/playlist
```

Look in console for:
- ✅ `[CACHE-SET]` - Item was cached
- ✅ `[CACHE-HIT]` - Item retrieved from cache
- ✅ No `Item too large, not caching` errors

### 6. Monitor Memory Growth

Let the server run for a few minutes with traffic.

```bash
ps aux | grep node
# Second column should be PID, check RSS column (3rd)
# Should NOT grow beyond 100-120 MB
```

Or use:
```bash
watch -n 1 'ps aux | grep node | grep -v grep'
# Watch RSS (memory) column in real-time
```

## ⚠️ Common Issues

### Issue: TypeError: Cannot find module

```
Error: Cannot find module './boundedCache'
```

**Fix:** Verify file exists:
```bash
ls server/utils/boundedCache.js
```

If missing, check that all three utility files were created correctly.

### Issue: ENABLE_MEMORY_LOGGING=true causes undefined errors

```
TypeError: memoryLoggingMiddleware is not a function
```

**Fix:** Check server/index.js imports:
```bash
grep "memoryLoggingMiddleware" server/index.js
```

Should show:
```javascript
const { memoryLoggingMiddleware, logMemorySnapshot } = require("./utils/memoryMonitor");
```

### Issue: /tasks endpoint still blocks

```bash
# Takes 30+ seconds to respond
time curl http://localhost:8080/tasks
```

**Fix:** Check that automaticTasks.js was updated:
```bash
grep "runTasksAsync" server/pages/automaticTasks.js
```

Should export the function, and server/index.js should import it.

### Issue: Cache not working (always misses)

Check:
1. Can you see `[CACHE-SET]` logs? If not, check cache.set() calls
2. Are TTLs too short? Default is 600 seconds (10 min)
3. Is cache max size too small? Default is 50MB

### Issue: Tasks never complete

```bash
curl http://localhost:8080/tasks/status
# Always returns: status: "running"
```

**Possible causes:**
1. TASK_CONCURRENCY too low - increase to 3-4
2. Database queries very slow - add more indexes
3. Spotify API rate limited - add backoff

**Debug:**
```bash
ENABLE_MEMORY_LOGGING=true node server/index.js
curl http://localhost:8080/tasks
sleep 30
curl http://localhost:8080/tasks/status | jq '.timing'
# Check how long each stage took
```

## Deployment to Fly.io

### 1. Verify Locally First

```bash
ENABLE_MEMORY_LOGGING=true node server/index.js
# Test endpoints manually
curl http://localhost:8080/tasks
```

### 2. Update fly.toml

```toml
[env]
ENABLE_MEMORY_LOGGING = "false"
TASK_CONCURRENCY = "2"
CACHE_MAX_SIZE_MB = "50"
```

### 3. Deploy

```bash
fly deploy

# Monitor logs
fly logs --follow
# Should see [ENDPOINT] entries if logging enabled
```

### 4. Test on Fly.io

```bash
fly ssh console
curl http://localhost:8080/tasks
# Should respond immediately
```

## Rollback Plan

If anything breaks, revert code changes:

```bash
# Keep the new utilities (they're non-breaking)
# Revert the changed files
git checkout server/index.js
git checkout server/pages/automaticTasks.js
git checkout server/routes/api.js

# This will go back to the original implementation
# But your old code will still break due to memory
```

Better: Keep the changes and adjust settings:

```env
TASK_CONCURRENCY=1    # Sequential (like old .then() but with early response)
```

## Performance Targets

After deployment, monitor:

| Metric | Target | Alert if exceeds |
|--------|--------|-----------------|
| Heap Used | 60-80 MB | > 100 MB |
| Response Time (/tasks) | < 100ms | > 1000ms |
| Cache Hit Rate | > 50% | < 20% |
| Task Duration | 20-40s | > 60s |
| Daily Restarts | 0 | > 0 |

If any metric exceeds alerts, adjust:
- Too much memory: Lower TASK_CONCURRENCY or CACHE_MAX_SIZE_MB
- Tasks too slow: Raise TASK_CONCURRENCY or optimize queries
- Cache misses: Increase CACHE_MAX_SIZE_MB or TTL

## Success Criteria

✅ All checks pass:
- [ ] Files created successfully
- [ ] Memory monitoring responds to requests
- [ ] /tasks endpoint returns in < 100ms instead of 30+ seconds
- [ ] /tasks/status shows task progress
- [ ] Cache system is evicting old entries
- [ ] Server memory stays < 100 MB
- [ ] Daily cron jobs complete without crashing
- [ ] No "Memory limit exceeded" restarts on Fly.io

Once all pass, you're done! The memory issue should be resolved.

