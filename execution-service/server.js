
const express = require('express');
const cors = require('cors');
const { WorkflowRunner } = require('./runner');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/execute', async (req, res) => {
    const { workflow, payment_data } = req.body;

    if (!workflow) {
        return res.status(400).json({ error: 'Missing workflow definition' });
    }

    console.log(`Received execution request for ${workflow.vendor_name}`);

    // Run asynchronously (fire and forget for now, or await for simple demo)
    // For this phase, we will await it to see the result immediately in the response
    const runner = new WorkflowRunner();
    await runner.init();
    const result = await runner.run(workflow, payment_data || {});

    res.json(result);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Execution Service running on ${PORT}`));
