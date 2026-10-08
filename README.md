# Web Monitoring System

Standalone website monitoring system running locally with Docker.

## Development policy
- Local development and execution only
- Docker Compose for runtime
- Git for version control
- No VPS or n8n dependency
- Build and verify the smallest working implementation first

## PHASE 1: HTTP check

Judgement: HTTP 200 is `UP`. Any other HTTP status, timeout, or connection error is `DOWN`.

Run commands from the project directory (Docker Desktop must be running):

```powershell
# Automated tests
docker-compose run --rm test

# Start the local target server and run the monitor against it (JSON output)
docker-compose run --rm monitor

# Stop containers
docker-compose down
```

Check any URL directly without Docker (Node 22+):

```powershell
$env:TIMEOUT_MS = "3000"
node src/cli.js http://localhost:8080/ok
```
