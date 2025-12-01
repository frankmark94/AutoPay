# GenAI Vendor Portal Payment Automation

A robust, automated system for processing payments across various vendor portals using Playwright and a centralized Orchestrator.

## Features
- **Orchestrator**: Centralized Express.js server to manage workflows and dispatch jobs.
- **Execution Service**: Playwright-based worker that handles browser automation.
- **Admin Console**: Next.js UI for managing workflows and triggering test runs.
- **Semantic Agent**: "Local Heuristic Agent" that resolves fields by intent (e.g., "enter credit card") rather than rigid selectors.
- **Production Ready**: Includes persistence, secure logging, and configuration options.

## Prerequisites
- Node.js v18+
- npm

## Setup

1.  **Install Dependencies**:
    ```bash
    # Root (for scripts)
    npm install

    # Services
    cd orchestrator && npm install
    cd ../execution-service && npm install
    cd ../mock-portals && npm install
    cd ../admin-console && npm install
    ```

2.  **Configuration**:
    Copy `.env.example` to `.env` in the root directory:
    ```bash
    cp .env.example .env
    ```

## Running the System

### Quick Start
Use the provided batch scripts in the root directory:

1.  **Start Backend Services** (Orchestrator, Execution Service, Mock Portals):
    ```powershell
    .\start-services.bat
    ```

2.  **Start Admin Console**:
    ```powershell
    .\start-frontend.bat
    ```

3.  **Access the UI**:
    Open [http://localhost:3000](http://localhost:3000).

## Testing & Verification

Scripts are located in the `scripts/` directory.

- **Seed Workflows**:
    ```powershell
    cd scripts
    .\seed-portal-2.bat
    ```
- **Run End-to-End Tests**:
    ```powershell
    cd scripts
    .\test-phase-3.bat
    ```

## Architecture

- **Orchestrator** (Port 3001): Brain of the operation. Stores workflows in `db.json`.
- **Execution Service** (Port 3002): Worker node. Runs Playwright.
- **Mock Portals** (Ports 4001-4003): Simulates vendor websites.
- **Admin Console** (Port 3000): User Interface.

## License
Private / Internal Use.
