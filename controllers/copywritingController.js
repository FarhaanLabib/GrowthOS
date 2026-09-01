const copywritingModel = require('../models/copywritingModel');

const toneWords = {
  Professional: ['Discover', 'Introducing', 'Experience'],
  Casual: ['Check out', 'Hey, look at', "Here's"],
  Urgent: ['Don\'t miss', 'Act now:', 'Last chance —'],
  Friendly: ['We think you\'ll love', 'Come see', 'Say hello to'],
  Bold: ['Unleash', 'Dominate with', 'Transform with']
};

function generateVariations({ businessType, offer, audience, tone }) {
  const openers = toneWords[tone] || toneWords.Professional;
  return openers.map(opener =>
    `${opener} ${offer} — built for ${audience} in ${businessType}. Get started today.`
  );
}

function generate(req, res) {
  const variations = generateVariations(req.body);
  res.json({ variations });
}

async function saveCopy(req, res) {
  const result = await copywritingModel.insertCopy({
    text: req.body.text,
    tone: req.body.tone,
    
    createdAt: new Date()
  });
  res.json(result);
}

async function getLibrary(req, res) {
  const items = await copywritingModel.getLibrary();
  res.json(items);
}

module.exports = { generate, saveCopy, getLibrary };