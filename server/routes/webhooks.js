const express = require('express');
const crypto = require('crypto');
const { handlePullRequestEvent } = require('../services/githubService');

const router = express.Router();
const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

const verifySignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return res.status(401).send('No signature');

  // Skip validation in dev if secret not properly set up
  if (!WEBHOOK_SECRET) return next();

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }
  next();
};

router.post('/github', verifySignature, async (req, res) => {
  const event = req.headers['x-github-event'];
  
  if (event === 'pull_request') {
    const action = req.body.action;
    if (action === 'opened' || action === 'synchronize') {
      try {
        await handlePullRequestEvent(req.body);
      } catch (e) {
        console.error('Error handling PR event:', e);
      }
    }
  }

  res.status(200).send('OK');
});

module.exports = router;
