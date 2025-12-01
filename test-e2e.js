
// Native fetch is available in Node 18+

async function runTest() {
    // 1. Create a Workflow
    console.log('Creating workflow...');
    await fetch('http://localhost:3001/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'TEST-AUTO',
            version: 1,
            workflow_json: {
                vendor_name: 'Test Automation Vendor',
                portal_url: 'http://localhost:4001/login',
                steps: [
                    { action: 'type', selector: '#user', field: 'username' }, // Login
                    { action: 'type', selector: '#pass', field: 'password' },
                    { action: 'click', selector: '#loginButton' },
                    { action: 'navigate', url: 'http://localhost:4001/pay' }, // Pay Page
                    { action: 'type', selector: '#invoice', field: 'invoice_number' },
                    { action: 'type', selector: '#amount', field: 'amount' },
                    { action: 'type', selector: '#card', field: 'card_number' },
                    { action: 'click', selector: '#submit' }
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
            vendor_code: 'TEST-AUTO',
            amount: '500.00',
            invoice_number: 'INV-999',
            card_token: '1234',
            mode: 'test'
        })
    });

    const result = await res.json();
    console.log('Result:', JSON.stringify(result, null, 2));
}

runTest().catch(console.error);
