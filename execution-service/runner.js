
const { chromium } = require('playwright');

class WorkflowRunner {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async init() {
        this.browser = await chromium.launch({ headless: false }); // Headful for demo/debugging
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
    }

    async close() {
        if (this.browser) await this.browser.close();
    }

    async run(workflow, paymentData) {
        const logs = [];
        const log = (msg) => {
            console.log(`[Runner] ${msg}`);
            logs.push({ timestamp: new Date(), message: msg });
        };

        try {
            log(`Starting workflow for ${workflow.vendor_name}`);

            // Login if provided (Basic implementation)
            if (workflow.portal_url) {
                log(`Navigating to portal: ${workflow.portal_url}`);
                await this.page.goto(workflow.portal_url);
            }

            // Execute Steps
            for (const step of workflow.steps) {
                log(`Executing step: ${step.action}`);

                switch (step.action) {
                    case 'navigate':
                        await this.page.goto(step.url);
                        break;

                    case 'click':
                        await this.page.click(step.selector);
                        break;

                    case 'type':
                        const value = paymentData[step.field] || 'DUMMY_DATA';
                        await this.page.fill(step.selector, value);
                        break;

                    case 'semantic_type':
                        log(`Resolving semantic step: "${step.intent}"`);
                        const selector = await this.findSemanticElement(step.intent);
                        if (selector) {
                            log(`Found element for "${step.intent}": ${selector}`);
                            const val = paymentData[step.field] || 'DUMMY_DATA';
                            await this.page.fill(selector, val);
                        } else {
                            throw new Error(`Could not find element for intent: ${step.intent}`);
                        }
                        break;

                    default:
                        log(`Unknown action: ${step.action}`);
                }

                // Small delay for visual debugging
                await this.page.waitForTimeout(1000);
            }

            log('Workflow completed successfully');
            return { success: true, logs };

        } catch (error) {
            log(`Error: ${error.message}`);
            return { success: false, error: error.message, logs };
        } finally {
            await this.close();
        }
    }

    async findSemanticElement(intent) {
        // Simple heuristic agent
        const lowerIntent = intent.toLowerCase();

        try {
            if (lowerIntent.includes('card') || lowerIntent.includes('cc')) {
                // Try common card field patterns
                const candidates = ['input[name*="card"]', 'input[name*="cc"]', 'input[placeholder*="Card"]', '.card-input'];
                for (const c of candidates) {
                    if (await this.page.$(c)) return c;
                }
            }

            if (lowerIntent.includes('amount') || lowerIntent.includes('total') || lowerIntent.includes('price')) {
                const candidates = ['input[name*="amount"]', 'input[name*="amt"]', 'input[placeholder*="Amount"]'];
                for (const c of candidates) {
                    if (await this.page.$(c)) return c;
                }
            }

            if (lowerIntent.includes('invoice') || lowerIntent.includes('reference') || lowerIntent.includes('bill')) {
                const candidates = ['input[name*="invoice"]', 'input[name*="ref"]', 'input[placeholder*="Invoice"]'];
                for (const c of candidates) {
                    if (await this.page.$(c)) return c;
                }
            }

            // Fallback: Try to find input near text matching the intent
            const words = lowerIntent.split(' ');
            for (const word of words) {
                if (word.length > 3) {
                    if (await this.page.$(`input[name*="${word}"]`)) return `input[name*="${word}"]`;
                }
            }

        } catch (e) {
            console.log('Error in heuristic resolution:', e);
        }

        return null;
    }
}

module.exports = { WorkflowRunner };
