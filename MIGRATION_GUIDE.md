# Migration Guide: Memory Optimizations

## What Changed & What To Do

### 1. Environment Configuration

Add to your `.env` file:

```env
# Enable memory-per-endpoint logging (optional but recommended initially)
ENABLE_MEMORY_LOGGING=true

# Configure task queue concurrency
# Lower values = less memory, slower processing
# Default is 2 - works well for 128MB instances
TASK_CONCURRENCY=2

# Rate limiting for automated tasks
ENABLE_LIMITS=true
ENABLE_HOURLY=true
ENABLE_DAILY=true
```

### 2. Task Endpoint Changes

**OLD BEHAVIOR:**
```javascript
// Old: Blocks until done
GET /tasks → {logs, timing}  // Could take 5+ minutes
```

**NEW BEHAVIOR:**
```javascript
// New: Returns immediately
GET /tasks → {status: "accepted", taskId, startedAt}
GET /tasks/status → {status, timing, logs}  // Poll this
```

**Update your client code:**

```javascript
// OLD: Wait for tasks to complete
async function runDailyTasks() {
  const response = await fetch('/tasks');
  const result = await response.json();
  console.log(result); // This waits 5+ minutes!
}

// NEW: Fire and forget + poll for results
async function runDailyTasks() {
  // Start tasks (returns immediately)
  const startResponse = await fetch('/tasks');
  const { taskId } = await startResponse.json();
  console.log(`Tasks started with ID: ${taskId}`);
  
  // Poll for completion
  let tasksDone = false;
  while (!tasksDone) {
    const statusResponse = await fetch('/tasks/status');
    const { status, timing, results } = await statusResponse.json();
    console.log(`Status: ${status}`);
    
    if (status === "completed") {
      console.log(`Completed in ${timing.totalMs}ms`);
      tasksDone = true;
    } else {
      // Wait before next poll
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}
```

### 3. Caching Changes

**Automatic** - No code changes needed. The cache behind the scenes:
- Limits size to 50MB
- Evicts oldest items when full
- Automatically sets TTLs

But beware:
- **Old code:** Relied on unlimited cache growth
- **New code:** Cache automatically purges old entries
- If you have custom cache calls, they'll still work

### 4. Database Query Changes

**If you wrote custom queries:**

Before:
```javascript
const users = await User.findAll(); // All users in memory!
```

After:
```javascript
// Fetch in batches
const users = await User.findAll({ limit: 50, offset: 0 });
// Process batch
// Then: offset += 50; repeat
```

This is already done in `automaticTasks.js` - just be aware if you add new task types.

### 5. Running the Server

```bash
# Development with memory monitoring
ENABLE_MEMORY_LOGGING=true node server/index.js

# Production
node server/index.js

# With lower task concurrency for very tight memory constraints
TASK_CONCURRENCY=1 node server/index.js
```

### 6. Monitoring the Changes

#### Check Memory Usage Per Endpoint

```bash
# With ENABLE_MEMORY_LOGGING=true, you'll see:
# [ENDPOINT] {method: "GET", path: "/api/me", heapDiff: "1.23 MB", ...}

# Look for high heapDiff values - those are memory hogs
```

#### Check Cache Efficiency

```bash
# Server logs show:
# [CACHE-HIT] playlist-user-123   # Great! Was cached
# [CACHE-SET] key="..." sizeKB="45" totalSizeMB="52"  # Cache growing

# If you see many [CACHE-SET] but few [CACHE-HIT], 
# cache TTL is too short or data too diverse
```

#### Verify Task Processing

```bash
$ curl http://localhost:8080/tasks
{"status":"accepted","taskId":1649534567890,"startedAt":1649534567890}

$ curl http://localhost:8080/tasks/status  
{"status":"running","taskId":1649534567890,...}

$ curl http://localhost:8080/tasks/status  # Wait a few seconds
{"status":"completed","taskId":1649534567890,"timing":{...}}
```

## Potential Issues & Fixes

### Issue: NPM Install Fails on Bounded Cache

**Error:**
```
Cannot find module './boundedCache'
```

**Fix:**
```bash
# Make sure boundedCache.js was created
ls -la server/utils/boundedCache.js

# If missing, the full file is in MEMORY_OPTIMIZATIONS.md
# Copy it to server/utils/boundedCache.js
```

### Issue: Cache Still Growing to 100+ MB

**Cause:** Cache max size not being honored or large single objects

**Debug:**
```bash
ENABLE_MEMORY_LOGGING=true node server/index.js
# Look for: [CACHE] Item too large, not caching
```

**Fix:**
```env
# Lower the cache max size
CACHE_MAX_SIZE_MB=30
CACHE_MAX_KEYS=5000
```

### Issue: Tasks Slow to Complete

**Cause:** TASK_CONCURRENCY=1 is too restrictive, or data processing is slow

**Debug:**
```bash
curl http://localhost:8080/tasks/status | jq '.timing'
# Look at hourlyTasksMs and dailyTasksMs
```

**Fix:**
```env
# Increase concurrency if memory permits
TASK_CONCURRENCY=3

# Or reduce batch size in automaticTasks.js if memory is still tight
```

### Issue: `ENABLE_MEMORY_LOGGING=true` Breaks Server

**Cause:** Middleware syntax error

**Fix:**
Make sure you have:
```javascript
app.use(memoryLoggingMiddleware);
```

In `server/index.js` before the routes are defined.

## Verify Everything Works

### 1. Start the server
```bash
ENABLE_MEMORY_LOGGING=true node server/index.js
```

### 2. Test each endpoint
```bash
curl http://localhost:8080/api/loggedin
curl http://localhost:8080/api/me
curl http://localhost:8080/api/me/playlist
curl http://localhost:8080/tasks
curl http://localhost:8080/tasks/status
```

### 3. Check for errors in console
Look for:
- ✅ No "Cannot find module" errors
- ✅ No "undefined is not a function" errors  
- ✅ Request endpoints show memory delta

### 4. Run on Fly.io
```bash
fly deploy

# Monitor memory usage
fly logs --follow
# Should see [ENDPOINT] logs with memory info
```

## Rollback Plan

If something breaks, revert these files:

```bash
git checkout server/pages/automaticTasks.js
git checkout server/index.js
git checkout server/routes/api.js
```

But keep the new utilities:
- `server/utils/memoryMonitor.js`
- `server/utils/boundedCache.js`
- `server/utils/taskQueue.js`

These are non-breaking additions.

## Questions?

Check `MEMORY_OPTIMIZATIONS.md` for detailed technical info on each change.

