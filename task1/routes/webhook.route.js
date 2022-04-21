const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhook.controller');

// GET
router.get('/', WebhookController.verify);
router.get('/setup', WebhookController.setup);

// POST
router.post('/', WebhookController.message);

module.exports = router;