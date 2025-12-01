PROJECT: GenAI Vendor Portal Payment Automation System
(Vibe Coding Edition)
This system allows an admin to define payment workflows for vendor websites, version them, and test them. A Playwright driven agent executes the workflows using virtual card data and invoice instructions. The admin console is the core of the system.

1. System Overview
The system has four major components:
	1. Admin Console (React or Next.js)
		○ A visual builder for vendor payment workflows
		○ Workflow versioning
		○ Workflow validation
		○ Test execution panel
	2. Workflow Orchestrator API (Node or Python)
		○ Stores workflows
		○ Resolves workflow by vendor and version
		○ Receives payment instructions
		○ Dispatches them to the worker
		○ Stores run results
	3. Playwright Execution Service
		○ Runs headless or headful browser automation
		○ Executes the workflow spec steps
		○ Collects DOM snapshots, HTML, screenshots
		○ Returns detailed step by step logs
		○ Works with the Agent Layer for semantic selector recovery
	4. Agent Layer (OpenAI or Claude Agent)
		○ Interprets workflows
		○ Handles selector deviations
		○ Handles exceptions
		○ Produces natural language run summaries

2. Admin Console Requirements
The Admin Console is where you define vendor workflows. It must support:
2.1 Workflow List Page
	• Table of all vendor workflows
	• Columns: Vendor Name, Workflow ID, Versions, Last Updated, Status
	• Actions: Create New, View, Duplicate, Archive
2.2 Create Workflow Page
Use a left panel for metadata and a right panel for step builder.
Metadata Fields:
	• Vendor Name
	• Vendor Code (unique slug like "VEND-001")
	• Workflow Display Name
	• Version (auto increment)
	• Notes field
	• Portal Login URL
	• Portal Payment URL (optional)
Credentials Section:
Stored as references (not raw secrets)
	• Username secret key reference
	• Password secret key reference
Step Builder:
Steps are stored as ordered items in a list. Users can add three types:
Step Types:
	1. Navigate step
		○ Type: "navigate"
		○ URL field
	2. Action step
		○ Type: "click", "type", "select", "wait_for"
		○ CSS selector
		○ Optional fallback selector list
		○ Optional field mapping (example: type field gets invoice_number)
	3. Semantic step
		○ Allows the agent to find the element using label text or intent
		○ Intent field: "find amount input", "find card number input"
		○ Expected element type: input, button, dropdown
Authentication Step Type:
	• Type: "login"
	• Username selector
	• Password selector
	• Submit selector
Success Criteria Builder:
User can add one or more:
	• Text appears
	• Selector exists
	• Page URL matches
	• DOM contains any of these strings
Save Workflow:
	• Validates structure
	• Creates versioned entry in DB
	• Returns workflow ID
2.3 Workflow Detail Page
Shows:
	• YAML or JSON representation
	• Version history
	• Diff between versions
	• Test run panel
	• Logs from previous runs
	• Screenshots from previous runs
2.4 Test Execution Panel
User provides testing payload:
	• Amount
	• Invoice number
	• Mock card token
	• Flags: dry run or full submission
Interface:
	• “Run Workflow” button
	• Console appears with:
		○ Step by step logs
		○ Agent decisions
		○ DOM snapshots
		○ Final evaluation (success or failure)

3. Workflow Specification Format
Workflows stored in a JSON or YAML schema like this:

vendor_code: "VEND-001"
version: 3
portal_url: "https://examplevendor.com/login"
login:
  username_selector: "#username"
  password_selector: "#password"
  submit_selector: "#loginButton"
steps:
  - action: navigate
    url: "https://examplevendor.com/pay"
- action: semantic_type
    intent: "enter invoice number"
    field: "invoice_number"
- action: semantic_type
    intent: "enter amount"
    field: "amount"
- action: semantic_type
    intent: "enter card number"
    field: "card_number"
- action: click
    selector: "#submitPayment"
success_criteria:
  - type: text
    value: "Payment submitted"
  - type: selector
    value: "#confirmationNumber"

4. Backend Requirements
4.1 REST API Endpoints
POST /workflow
Create or update vendor workflow version.
GET /workflow/:vendor_code
Return latest workflow metadata.
GET /workflow/:vendor_code/:version
Return specific version.
POST /workflow/:vendor_code/:version/test
Trigger test run.
POST /payment
Trigger a real or test payment.
GET /payment/:payment_id
Get result and logs.
4.2 Authentication and Roles
	• Admin role for workflow building
	• Operator role for running tests
	• System role for workers

5. Database Schema
Use Postgres. DB tables:
Table: vendors
	• id (uuid)
	• vendor_code (text unique)
	• name (text)
	• created_at
	• updated_at
Table: workflows
	• id (uuid)
	• vendor_code (text)
	• version (int)
	• workflow_json (jsonb)
	• is_active (bool)
	• created_at
	• updated_at
Composite unique key: (vendor_code, version)
Table: workflow_runs
	• id (uuid)
	• workflow_id
	• vendor_code
	• version
	• run_type: test or production
	• input_payload (jsonb)
	• output_report (jsonb)
	• status
	• started_at
	• finished_at
Table: credentials_reference
	• vendor_code
	• username_secret_ref
	• password_secret_ref

6. Playwright Execution Service Requirements
This service should receive:

{
  "workflow": { ...workflow JSON... },
  "payment_data": {
    "invoice_number": "INV-1001",
    "amount": "1299.99",
    "card_token": "tok_123"
  },
  "execution_id": "run_abc123",
  "mode": "test"
}
Responsibilities:
	1. Start a browser session
	2. Perform login (if provided)
	3. For each step:
		○ If deterministic: perform directly
		○ If semantic: call the Agent Selector Tool
	4. Capture:
		○ DOM snapshots
		○ HTML
		○ Screenshots
		○ Timing
	5. Evaluate success criteria
	6. Package output for Orchestrator
Browser must run inside a secure sandbox.

7. Agent Layer Requirements
The agent must have the following tools available:
	1. get_dom_snapshot
Returns inner HTML of the page or a specific region.
	2. query_selector_candidates
Given intent text, find possible matching elements.
	3. playwright_action
Perform click, type, select, wait.
	4. take_screenshot
Capture PNG.
	5. log_event
Append logs with reasoning.
Agent responsibilities:
	• Interpret workflow JSON
	• If a selector fails, call semantics to find alternative
	• If page changes unexpectedly, describe what changed
	• At end, output structured JSON:

{
  "status": "SUCCESS",
  "confirmation_number": "CNF-889123",
  "events": [ ... ],
  "screenshots": [ ... ],
  "dom_extracts": [ ... ]
}

8. Security Model
PCI considerations:
	• Card PAN never goes into model context
	• Tools abstract card entry (“type_card_number”)
	• Model only sees metadata (last four digits)
Secrets:
	• Stored in provider like AWS Secrets Manager
	• Fetched server side
	• Not available to the model
Whitelisted domains:
Browser cannot go to arbitrary domains.

9. Example Payment Portals (for Dev Environment)
You will build three mock portals to test the workflows.
Portal 1: Basic
URL: http://localhost:4001
Features:
	• Basic login form
	• Simple Pay Invoice page
	• Fields:
		○ invoice number
		○ amount
		○ card number
	• Confirmation page with text “Payment submitted”
Portal 2: Modal Heavy
URL: http://localhost:4002
Features:
	• Pop up asking user to accept terms
	• Extra “confirm amount” dialog
	• Confirmation number appears inside shadow DOM
Portal 3: Semantic Challenge Portal
URL: http://localhost:4003
Features:
	• Labels not associated directly to inputs
	• Dynamic class names
	• Payment button appears only after all fields filled
	• Success page changes DOM structure based on amount range
Each portal should be containerized with Docker for easy startup.

10. Example Workflow Specs for These Portals
Workflow A: Portal 1 basic

vendor_code: "VEND-TEST1"
version: 1
portal_url: "http://localhost:4001/login"
login:
  username_selector: "#user"
  password_selector: "#pass"
  submit_selector: "#loginButton"
steps:
  - action: navigate
    url: "http://localhost:4001/pay"
- action: type
    selector: "#invoice"
    field: "invoice_number"
- action: type
    selector: "#amount"
    field: "amount"
- action: semantic_type
    intent: "enter card number"
    field: "card_number"
- action: click
    selector: "#submit"
success_criteria:
  - type: text
    value: "Payment submitted"
Workflow B: Portal 2 modal heavy
Uses semantic steps to bypass modal.
Workflow C: Portal 3 selector drift
Uses LLM for locator resolution frequently.

11. Implementation Roadmap
Phase 1: Admin Console and Workflow Storage
Phase 2: Playwright Worker + Simple Execution
Phase 3: Agent Layer with Semantic Actions
Phase 4: Test Portals and Workflow Iteration
Phase 5: Production Hardening
Phase 6: Multi vendor rollout and analytics dashboard
