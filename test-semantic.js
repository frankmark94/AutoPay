
// Native fetch is available in Node 18+

async function runTest() {
    // 1. Create a Workflow for Portal 3 (Semantic Challenge)
    // Portal 3 has fields like 'ref', 'amt', 'cc' which don't match standard names exactly,
    // and we will use INTENTS to find them.

    console.log('Creating Semantic Workflow...');
    await fetch('http://localhost:3001/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'SEMANTIC-TEST',
            version: 1,
            workflow_json: {
                vendor_name: 'Semantic Challenge Vendor',
                portal_url: 'http://localhost:4003/login',
                steps: [
                    // Login (Portal 3 has weird class names, let's try to find them by heuristics or just hardcode for now to get to the good part)
                    // For the sake of this demo, we'll use the "fallback" heuristic which matches "user" to "input-field-1"?? No, that won't work.
                    // Let's assume the Agent is smart enough to handle the login via standard selectors for now, 
                    // and test the SEMANTIC features on the payment page.
                    { action: 'type', selector: '.input-field-1', field: 'username' },
                    { action: 'type', selector: '.input-field-2', field: 'password' },
                    { action: 'click', selector: '.clickable' },

                    // Semantic Steps on Bill Pay Page
                    // The page has inputs named 'ref', 'amt', 'cc'.
                    // We will use intents that DON'T match the names exactly.
                    { action: 'semantic_type', intent: 'enter bill reference', field: 'invoice_number' },
                    { action: 'semantic_type', intent: 'enter total amount', field: 'amount' },
                    { action: 'semantic_type', intent: 'enter credit card', field: 'card_number' },

                    { action: 'click', selector: 'button' }
                ]
            }
        })
    });

    // 2. Trigger Payment
    console.log('Triggering payment...');
    const res = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'SEMANTIC-TEST',
            amount: '88.50',
            invoice_number: 'BILL-2024-X',
            card_token: '4111-2222-3333-4444',
            mode: 'test'
        })
    });

    const result = await res.json();
    console.log('Result:', JSON.stringify(result, null, 2));
}

runTest().catch(console.error);
