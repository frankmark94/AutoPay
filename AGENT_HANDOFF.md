# Agent Handoff Protocol

**Project**: GenAI Vendor Portal Payment Automation
**Last Updated**: 2025-11-30
**Status**: Phase 5 Complete (Production Hardening)

## System Overview
This project automates payments on vendor portals. It consists of 4 microservices:
1.  **Orchestrator** (`orchestrator/`): Express server. Manages workflows. Persists to `db.json`.
2.  **Execution Service** (`execution-service/`): Node/Playwright. Executes steps. Includes `WorkflowRunner` class with `findSemanticElement` for heuristic resolution.
3.  **Admin Console** (`admin-console/`): Next.js 14 (App Router). UI for management.
4.  **Mock Portals** (`mock-portals/`): Express server serving 3 distinct portals for testing.

## Key Files
- `orchestrator/index.js`: Main logic for dispatching jobs and persistence.
- `execution-service/runner.js`: Core automation logic. **Critical**: Contains the "Local Heuristic Agent" logic.
- `admin-console/src/app/workflows/[id]/page.tsx`: The main UI for testing workflows.
- `scripts/`: Contains all test and seed scripts.

## Current State
- **Phases 1-5 Complete**:
    - Basic setup, Execution Service, Semantic Agent, UI Integration, Hardening.
- **Persistence**: Workflows are saved to `orchestrator/db.json`.
- **Security**: Logs redact credit card numbers.
- **Config**: `.env` controls Headless mode.

## Next Steps (Phase 6+)
- **Multi-Vendor Rollout**: Support for real vendor portals (not just mocks).
- **Analytics Dashboard**: Visualize success rates and spending.
- **LLM Integration**: Replace the "Heuristic Agent" in `runner.js` with a real LLM (OpenAI/Gemini) for complex portals.

## Known Issues / Gotchas
- **Stale Processes**: If `start-services.bat` fails, check for orphan `node` processes holding ports 3001/3002.
- **Headless Mode**: Toggling `HEADLESS` in `.env` requires restarting the Execution Service.
- **Scripts**: Run scripts from the `scripts/` directory to ensure relative paths work if they use `require`.

## Git
- Repo: `https://github.com/frankmark94/AutoPay.git`
- Branch: `master`
