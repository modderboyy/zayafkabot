const express = require('express');
const webhookHandler = require('./api/webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Webhook endpoint
app.post('/webhook', webhookHandler);

// Health check
app.get('/', (req, res) => {
    res.json({ 
        status: 'Bot is running!',
        timestamp: new Date().toISOString()
    });
});

// Start server (for local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
    });
}

module.exports = app;