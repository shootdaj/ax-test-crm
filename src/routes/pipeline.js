const { Router } = require('express');
const store = require('../data/store');

const router = Router();

// Get pipeline summary - deals grouped by stage with totals
router.get('/', (req, res) => {
  const allDeals = Array.from(store.deals.values());
  const stages = store.pipelineStages;

  const pipeline = stages.map(stage => {
    const stageDeals = allDeals.filter(d => d.stage === stage);
    const totalValue = stageDeals.reduce((sum, d) => sum + (d.value || 0), 0);

    // Enrich deals with contact/company names
    const enrichedDeals = stageDeals.map(deal => {
      const contact = deal.contact_id ? store.getContact(deal.contact_id) : null;
      const company = deal.company_id ? store.getCompany(deal.company_id) : null;
      const daysInStage = deal.stage_entered_at
        ? Math.floor((Date.now() - new Date(deal.stage_entered_at).getTime()) / 86400000)
        : 0;

      return {
        ...deal,
        contact_name: contact ? contact.name : null,
        company_name: company ? company.name : null,
        days_in_stage: daysInStage
      };
    });

    return {
      stage,
      count: stageDeals.length,
      totalValue,
      deals: enrichedDeals
    };
  });

  res.json({ stages: pipeline });
});

// Get pipeline analytics
router.get('/analytics', (req, res) => {
  const allDeals = Array.from(store.deals.values());
  const stages = store.pipelineStages;

  // Total pipeline value (excluding closed lost)
  const activePipelineValue = allDeals
    .filter(d => d.stage !== 'Closed Lost' && d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  // Won deals
  const wonDeals = allDeals.filter(d => d.stage === 'Closed Won');
  const wonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Lost deals
  const lostDeals = allDeals.filter(d => d.stage === 'Closed Lost');

  // Win rate
  const closedDeals = wonDeals.length + lostDeals.length;
  const winRate = closedDeals > 0 ? Math.round((wonDeals.length / closedDeals) * 100) : 0;

  // Average deal cycle time (for won deals)
  let avgCycleTime = 0;
  if (wonDeals.length > 0) {
    const cycleTimes = wonDeals.map(d => {
      const created = new Date(d.created_at).getTime();
      const updated = new Date(d.updated_at).getTime();
      return Math.floor((updated - created) / 86400000);
    });
    avgCycleTime = Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length);
  }

  // Conversion rates between stages
  const stageCounts = {};
  stages.forEach(stage => {
    stageCounts[stage] = allDeals.filter(d => {
      // A deal "reached" a stage if it's currently there or has passed through it
      const history = store.getDealHistory(d.id);
      return history.some(h => h.to === stage) || d.stage === stage;
    }).length;
  });

  const conversionRates = [];
  for (let i = 0; i < stages.length - 2; i++) { // exclude Closed Won and Closed Lost
    const from = stages[i];
    const to = stages[i + 1];
    const fromCount = stageCounts[from] || 0;
    const toCount = stageCounts[to] || 0;
    const rate = fromCount > 0 ? Math.round((toCount / fromCount) * 100) : 0;
    conversionRates.push({ from, to, rate, fromCount, toCount });
  }

  // Value per stage
  const valuePerStage = stages.map(stage => ({
    stage,
    count: allDeals.filter(d => d.stage === stage).length,
    value: allDeals.filter(d => d.stage === stage).reduce((sum, d) => sum + (d.value || 0), 0)
  }));

  res.json({
    activePipelineValue,
    wonValue,
    wonCount: wonDeals.length,
    lostCount: lostDeals.length,
    winRate,
    avgCycleTime,
    conversionRates,
    valuePerStage,
    totalDeals: allDeals.length
  });
});

module.exports = router;
