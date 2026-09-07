const clientReportModel = require('../models/clientReportModel');

async function createReport(req, res) {
  const report = {
    clientId: req.body.clientId,
    clientName: req.body.clientName,
    adSpend: req.body.adSpend || 0,
    leadsGenerated: req.body.leadsGenerated || 0,
    cpl: req.body.cpl || 0,
    appointmentsBooked: req.body.appointmentsBooked || 0,
    dealsWon: req.body.dealsWon || 0,
    updatedAt: new Date()
  };
  const result = await clientReportModel.insertReport(report);
  res.json(result);
}

async function getReport(req, res) {
  const report = await clientReportModel.getLatestReport(req.params.clientId);
  res.json(report || { message: 'No report found for this client' });
}

module.exports = { createReport, getReport };