
const fetch = require('node-fetch'); // Ensure you have this or use Node 18+

async function verify() {
    console.log('1. Seeding Workflow (to test persistence)...');
    await fetch('http://localhost:3001/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'HARDEN-TEST',
            version: 1,
            workflow_json: {
                vendor_name: 'Hardened Vendor',
                portal_url: 'http://localhost:4003/login',
                steps: [
                    { action: 'type', selector: '#user', field: 'username' }, // Dummy steps
                    { action: 'semantic_type', intent: 'enter credit card', field: 'card_number' }
                ]
            }
        })
    });

    console.log('2. Triggering Payment (to test redaction)...');
    const res = await fetch('http://localhost:3001/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'HARDEN-TEST',
            amount: '10.00',
            invoice_number: 'INV-SECURE',
            card_token: '4111-2222-3333-4444', // This should be redacted
            mode: 'test'
        })
    });

    const result = await res.json();
    console.log('Execution Result:', result.success ? 'SUCCESS' : 'FAILED');

    console.log('\n--- LOGS (Check for Redaction) ---');
    result.logs.forEach(l => console.log(l.message));
    console.log('----------------------------------');

    if (JSON.stringify(result.logs).includes('4111-2222')) {
        console.error('FAIL: Secret was NOT redacted!');
    } else {
        console.log('PASS: Secret was redacted.');
    }
}

verify().catch(console.error);
