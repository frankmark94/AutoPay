@echo off
echo Starting Payment Automation System...

echo Starting Orchestrator...
start "Orchestrator" cmd /k "node orchestrator/index.js"

echo Starting Admin Console...
cd admin-console
start "Admin Console" cmd /k "npm run dev"

echo Done! Access the app at http://localhost:3000
