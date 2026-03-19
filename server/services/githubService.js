const { Octokit } = require('@octokit/rest');
const axios = require('axios');
const User = require('../models/User');

// Services that we will create soon
const { generateAIReview } = require('./aiReviewService');
const { getRiskPrediction } = require('./riskPredictionService');

const getOctokitForUser = async (githubId) => {
  const user = await User.findOne({ githubId: String(githubId) });
  if (!user || !user.accessToken) throw new Error('User not found or unauthenticated');
  
  return new Octokit({ auth: user.accessToken });
};

const handlePullRequestEvent = async (payload) => {
  const pr = payload.pull_request;
  const repo = payload.repository;
  const senderId = payload.sender.id; // User who opened the PR
  
  console.log(`Processing PR #${pr.number} in ${repo.full_name}`);

  try {
    const octokit = await getOctokitForUser(senderId);

    // 1. Fetch PR patch/diff
    const { data: diff } = await octokit.rest.pulls.get({
      owner: repo.owner.login,
      repo: repo.name,
      pull_number: pr.number,
      mediaType: {
        format: 'diff'
      }
    });

    console.log(`Fetched diff for PR #${pr.number}. Diff length: ${diff.length}`);

    // 2. Extract commit metadata for risk prediction
    const filesChanged = pr.changed_files || 0;
    const linesAdded = pr.additions || 0;
    const linesDeleted = pr.deletions || 0;
    
    const risk = await getRiskPrediction({
      files_changed: filesChanged,
      lines_added: linesAdded,
      lines_deleted: linesDeleted
    });

    console.log(`Risk Prediction: ${risk.risk_level} (${risk.risk_score})`);

    // 3. Call OpenAI/Anthropic for Code Review if diff exists
    let reviewComment = 'No code chunks to review.';
    if (diff && diff.length > 0) {
      // Avoid sending massive diffs
      const truncatedDiff = diff.substring(0, 10000); 
      reviewComment = await generateAIReview(truncatedDiff);
    }

    // 4. Post comments back to GitHub PR
    const commentBody = `### 🤖 AutoDev AI Code Review\n\n**Bug Risk Prediction**: ${risk.risk_level} (${risk.risk_score})\n\n${reviewComment}`;
    
    await octokit.rest.issues.createComment({
      owner: repo.owner.login,
      repo: repo.name,
      issue_number: pr.number, // PRs are fundamentally issues in GH API
      body: commentBody
    });

    console.log(`Successfully posted AI review for PR #${pr.number}`);

  } catch (error) {
    console.error(`Failed to handle PR #${pr.number}:`, error.message);
  }
};

module.exports = {
  handlePullRequestEvent
};
