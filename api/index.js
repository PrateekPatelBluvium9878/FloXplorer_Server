// api/index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// -----------------------------
// FAKE AI FUNCTIONS
// -----------------------------

// FAKE summary based on provided flow structure
const getFakeAiSummary = (flowId, aiModel) => {
    console.log(`[Server] Generating FAKE summary for flow ${flowId} using ${aiModel}`);

    return `Auto-launched flow that updates the email address of related contacts when an Account's custom email field changes.`;
};

// FAKE intelligent replies for user’s questions
const getFakeAiChatReply = (question, aiModel) => {
    console.log(`[Server] Generating FAKE chat reply for "${question}" using ${aiModel}`);

    // Basic keyword-based mock responses for a realistic demo
    if (/trigger|start/i.test(question)) {
        return `The flow is triggered when the Account's **Email__c** field changes. Since it's an *after-save record-triggered flow*, it runs automatically after the record is updated.`;
    }

    if (/loop/i.test(question)) {
        return `The loop, named **Loop all contacts**, iterates through all Contacts related to the Account. For each contact, it checks if the email matches the Account email before updating it.`;
    }

    if (/update|contact/i.test(question)) {
        return `Contacts are updated in bulk at the end of the flow using the **Update contacts with new email** element. This ensures only mismatched contacts are updated efficiently.`;
    }

    if (/note|create/i.test(question)) {
        return `At the end of the flow, a **Note** record is created with the title *"Email updated on related contacts"*, helping users track when changes were made.`;
    }

    if (/error|fail/i.test(question)) {
        return `In this demo version, there’s no explicit fault path. In a real implementation, you could add a fault connector to handle failed contact updates or note creation.`;
    }

    // Default generic fallback
    return `That’s an interesting question! Based on this flow, it primarily handles synchronizing emails between Accounts and their related Contacts.`;
};

// -----------------------------
// ENDPOINT 1: Initial Summary
// -----------------------------
app.post('/api/get-initial-data', async (req, res) => {
    const { sessionId, salesforceHost, flowId } = req.body;
    console.log('[Server] Received request for initial data:', { salesforceHost, flowId });

    if (!sessionId || !salesforceHost || !flowId) {
        return res.status(400).json({ error: 'Missing required Salesforce data from the extension.' });
    }

    const fakeUsername = "Prateek (from Server)";
    const fakeSummary = getFakeAiSummary(flowId, 'Gemini');

    res.status(200).json({
        username: fakeUsername,
        summary: fakeSummary
    });
});

// -----------------------------
// ENDPOINT 2: Chat Interaction
// -----------------------------
app.post('/api/chat', async (req, res) => {
    const { question, aiModel } = req.body;
    console.log('[Server] Received chat message:', { question, aiModel });

    if (!question || !aiModel) {
        return res.status(400).json({ error: 'Missing question or aiModel.' });
    }

    const fakeReply = getFakeAiChatReply(question, aiModel);
    res.status(200).json({ reply: fakeReply });
});

module.exports = app;
