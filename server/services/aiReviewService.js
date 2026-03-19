const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const generateAIReview = async (diff) => {
  if (OPENAI_API_KEY) {
    console.log('Generating review with OpenAI');
    return generateWithOpenAI(diff);
  } else if (ANTHROPIC_API_KEY) {
    console.log('Generating review with Anthropic');
    return generateWithAnthropic(diff);
  } else {
    throw new Error('No AI API key configured');
  }
};

const generateWithOpenAI = async (diff) => {
  const prompt = `Review the following GitHub PR diff and provide a short, constructive code review comment. Focus on potential bugs, security vulnerabilities, or performance issues. If there are none, simply say "Looks good to me!".\n\nDiff:\n${diff}`;
  
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  }, {
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` }
  });

  return response.data.choices[0].message.content;
};

const generateWithAnthropic = async (diff) => {
  const prompt = `Review the following GitHub PR diff and provide a short, constructive code review comment. Focus on potential bugs, security vulnerabilities, or performance issues. If there are none, simply say "Looks good to me!".\n\nDiff:\n${diff}`;
  
  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  });

  return response.data.content[0].text;
};

module.exports = { generateAIReview };
