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

const getFakeAiChatReply = (question, aiModel) => {
    console.log(`[Server] Generating FAKE chat reply for "${question}" using ${aiModel}`);

    const q = question.toLowerCase();

    if (q.includes('trigger') || q.includes('start')) {
        return `The flow is triggered when an Account's Email__c field is changed. Since it’s an after-save record-triggered flow, it runs automatically after the Account record is updated.`;
    }

    if (q.includes('get') && q.includes('contact')) {
        return `The Get related contacts element retrieves all Contact records where the AccountId matches the current Account. These are then passed into the loop for further processing.`;
    }

    if (q.includes('loop')) {
        return `The Loop all contacts element goes through each related Contact one by one to compare the Contact's email with the Account's updated Email__c value.`;
    }

    if (q.includes('decision') || q.includes('match')) {
        return `The decision element named Does Contact email match with Account email checks whether the Contact's Email equals the Account's Email__c. If they match, the flow skips the update. If not, it proceeds to update the email.`;
    }

    if (q.includes('assign') || q.includes('update email')) {
        return `The Assign Account Email on Contact element updates the Contact's Email field to match the Account's Email__c and adds that Contact to a collection variable for bulk update.`;
    }

    if (q.includes('update') && q.includes('contact')) {
        return `Contacts collected in the ContactsToBeUpdated variable are bulk-updated in the Update contacts with new email element. This ensures all contacts have the latest email address.`;
    }

    if (q.includes('note') || q.includes('create')) {
        return `After updating contacts, the Create Note element adds a Note record related to the Account with the title "Email updated on related contacts" to maintain an audit trail.`;
    }

    if (q.includes('end') || q.includes('finish')) {
        return `The flow completes after the Note record is created, ensuring both data consistency and documentation of the update.`;
    }

    if (q.includes('error') || q.includes('fail')) {
        return `Currently, there is no fault path defined in the flow. You can add a fault connector from the Update or Create Note elements to handle exceptions and log them for troubleshooting.`;
    }

    // 🎯 HARD QUESTION – for showing FloXplorer's intelligence
    if (q.includes('optimize') || q.includes('improve') || q.includes('performance')) {
        return `This flow could be optimized by using a scheduled path or asynchronous update to handle large data volumes more efficiently. Additionally, using a single DML operation at the end (as this flow already does) prevents hitting governor limits, which is a good design choice.`;
    }

    return `This flow manages synchronization of email addresses between an Account and its related Contacts using a combination of record-triggered logic, loops, decisions, and updates.`;
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
