const express = require('express');
const router = express.Router();
const WebhookRoute = require('./webhook.route');

router.use('/webhook', WebhookRoute);

module.exports = router;