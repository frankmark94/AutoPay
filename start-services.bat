@echo off
echo Starting All Backend Services...

echo Starting Mock Portals...
start "Mock Portals" cmd /k "node mock-portals/server.js"

echo Starting Execution Service...
start "Execution Service" cmd /k "cd execution-service && node server.js"

echo Starting Orchestrator...
start "Orchestrator" cmd /k "node orchestrator/index.js"

echo All services started! You can now run the test script.
pause
