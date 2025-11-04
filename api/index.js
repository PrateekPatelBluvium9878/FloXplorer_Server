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

    // Normalize for easier matching
    const q = question.toLowerCase();

    if (q.includes('trigger') || q.includes('start')) {
        return `The flow is triggered when an Account’s **Email__c** field is changed. Since it’s an *after-save record-triggered flow*, it runs automatically after the Account record is updated.`;
    }

    if (q.includes('get') && q.includes('contact')) {
        return `The **"Get related contacts"** element queries all Contact records whose **AccountId** matches the current Account. These records are then passed into the loop for processing.`;
    }

    if (q.includes('loop')) {
        return `The **"Loop all contacts"** element iterates through each related Contact retrieved earlier. It checks each contact’s email address against the Account’s updated **Email__c** value.`;
    }

    if (q.includes('decision') || q.includes('match')) {
        return `The decision element **"Does Contact email match with Account email?"** checks whether the Contact’s Email matches the Account’s Email__c field. If it matches, the contact is skipped. If not, the flow moves on to update the contact’s email.`;
    }

    if (q.includes('assign') || q.includes('update email')) {
        return `The **"Assign Account Email on Contact"** assignment sets the Contact’s Email field to the Account’s **Email__c** value. Then, **"Add contact to collection"** adds that contact to the update list.`;
    }

    if (q.includes('update') || q.includes('contact')) {
        return `Contacts collected in **ContactsToBeUpdated** are bulk-updated in the **"Update contacts with new email"** element. This ensures all contacts whose emails didn’t match get updated efficiently.`;
    }

    if (q.includes('note') || q.includes('create')) {
        return `After the update, the flow uses the **"Create Note"** element to insert a new Note record. Its **ParentId** is set to the Account Id, and its **Title** is *"Email updated on related contacts"*, serving as a log for this action.`;
    }

    if (q.includes('end') || q.includes('finish')) {
        return `The flow ends after successfully creating the Note. At this point, all related Contacts have updated emails, and a Note record documents the change.`;
    }

    if (q.includes('error') || q.includes('fail')) {
        return `Currently, the flow doesn’t have a fault connector configured. However, you can add one after the **Update** or **Create Note** elements to capture errors in case any record update fails.`;
    }

    // Default generic fallback
    return `This flow mainly handles synchronization of email addresses between an Account and its related Contacts using assignments, loops, and decisions.`;
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
