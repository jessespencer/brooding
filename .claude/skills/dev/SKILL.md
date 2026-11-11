---
name: dev
description: Start the local dev server for the static site.
disable-model-invocation: true
allowed-tools: Bash
---

# Start Dev Server

Start the local static file server and open the site in the browser.

## Steps

### Step 1: Kill any existing process on port 3000

```bash
kill $(lsof -ti:3000) 2>/dev/null; echo "Port 3000 cleared"
```

### Step 2: Start the dev server (background)

```bash
cd "$(git rev-parse --show-toplevel)" && npx serve . -p 3000
```

Run this in the background. Wait a few seconds then verify it started:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

A `200` response means the server is up.

### Step 3: Confirm everything is running

Report the status:
- Server: http://localhost:3000
- Rive animation should load and hover interaction should work (eyes open/close)
