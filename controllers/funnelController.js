const funnelModel = require('../models/funnelModel');

async function listFunnels(req, res) {
  const funnels = await funnelModel.getAllFunnels();
  res.json(funnels);
}

async function createFunnel(req, res) {
  const funnel = {
    name: req.body.name,
    steps: req.body.steps || [],
    createdAt: new Date()
  };
  const result = await funnelModel.createFunnel(funnel);
  res.json(result);
}

async function recordVisit(req, res) {
  const field = `steps.${req.params.stepIndex}.visitors`;
  const result = await funnelModel.incrementStepField(req.params.funnelId, field);
  res.json(result);
}

async function recordProgress(req, res) {
  const field = `steps.${req.params.stepIndex}.progressed`;
  const result = await funnelModel.incrementStepField(req.params.funnelId, field);
  res.json(result);
}

module.exports = { listFunnels, createFunnel, recordVisit, recordProgress };