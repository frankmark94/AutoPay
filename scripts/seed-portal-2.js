
async function seedPortal2() {
    console.log('Seeding Portal 2 Workflow...');
    await fetch('http://localhost:3001/workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            vendor_code: 'MODAL-TEST',
            version: 1,
            workflow_json: {
                vendor_name: 'Modal Heavy Vendor',
                portal_url: 'http://localhost:4002/login',
                steps: [
                    // Login
                    { action: 'type', selector: '#u', field: 'username' },
                    { action: 'type', selector: '#p', field: 'password' },
                    { action: 'click', selector: '#btn-login' },

                    // Dashboard -> Open Modal
                    { action: 'click', selector: '#pay-btn' },

                    // Modal Form
                    { action: 'type', selector: 'input[name="invoice"]', field: 'invoice_number' },
                    { action: 'type', selector: 'input[name="amount"]', field: 'amount' },
                    { action: 'type', selector: 'input[name="card"]', field: 'card_number' },

                    // Checkbox
                    { action: 'click', selector: '#terms' },

                    // Submit
                    { action: 'click', selector: '#modal button[type="submit"]' }
                ]
            }
        })
    });
    console.log('Done!');
}

seedPortal2().catch(console.error);
