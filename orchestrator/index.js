require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Mock DB for now if no connection
const workflows = [];

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Create/Update Workflow
app.post('/workflow', async (req, res) => {
    const { vendor_code, version, workflow_json } = req.body;
    // TODO: Save to DB
    workflows.push({ vendor_code, version, workflow_json });
    console.log(`Saved workflow for ${vendor_code} v${version}`);
    res.json({ success: true, id: 'mock-id' });
});

// Get Workflow
app.get('/workflow/list', async (req, res) => {
    res.json(workflows);
});

app.get('/workflow/:vendor_code', async (req, res) => {
    const { vendor_code } = req.params;
    const wf = workflows.find(w => w.vendor_code === vendor_code); // Get latest
    if (!wf) return res.status(404).json({ error: 'Not found' });
    res.json(wf);
});

// Trigger Payment (Test or Real)
app.post('/payment', async (req, res) => {
    const { vendor_code, amount, invoice_number, card_token, mode } = req.body;
    console.log(`Triggering payment for ${vendor_code}: ${amount}`);

    // Find the workflow
    const workflow = workflows.find(w => w.vendor_code === vendor_code);
    if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
    }

    try {
        // Dispatch to Execution Service
        const response = await fetch('http://localhost:3002/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                workflow: workflow.workflow_json,
                payment_data: { amount, invoice_number, card_token }
            })
        });

        const result = await response.json();

        res.json({
            success: result.success,
            execution_id: 'run_' + Date.now(),
            logs: result.logs,
            error: result.error
        });
    } catch (err) {
        console.error('Execution failed:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`--- ORCHESTRATOR V2 (EXECUTION SERVICE ENABLED) ---`);
    console.log(`Orchestrator running on ${PORT}`);
});
