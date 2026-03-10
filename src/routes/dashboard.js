const { Router } = require('express');
const store = require('../data/store');

const router = Router();

router.get('/', (req, res) => {
  const allDeals = Array.from(store.deals.values());
  const allContacts = Array.from(store.contacts.values());
  const allActivities = Array.from(store.activities.values());
  const allCompanies = Array.from(store.companies.values());

  // Total pipeline value (active deals only)
  const activePipelineValue = allDeals
    .filter(d => d.stage !== 'Closed Lost' && d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + (d.value || 0), 0);

  // Deals closing this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
  const dealsClosingThisMonth = allDeals.filter(d =>
    d.expected_close_date &&
    d.expected_close_date >= monthStart.split('T')[0] &&
    d.expected_close_date <= monthEnd.split('T')[0] &&
    d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );

  // Won deals value
  const wonDeals = allDeals.filter(d => d.stage === 'Closed Won');
  const totalWonValue = wonDeals.reduce((sum, d) => sum + (d.value || 0), 0);

  // Top contacts by deal value
  const contactDealValues = {};
  allDeals.forEach(d => {
    if (d.contact_id && d.stage !== 'Closed Lost') {
      contactDealValues[d.contact_id] = (contactDealValues[d.contact_id] || 0) + d.value;
    }
  });
  const topContacts = Object.entries(contactDealValues)
    .map(([id, totalValue]) => {
      const contact = store.getContact(id);
      return contact ? { id, name: contact.name, company: contact.company, totalValue } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5);

  // Activity stats
  const activityStats = {
    total: allActivities.length,
    calls: allActivities.filter(a => a.type === 'call').length,
    emails: allActivities.filter(a => a.type === 'email').length,
    meetings: allActivities.filter(a => a.type === 'meeting').length,
    notes: allActivities.filter(a => a.type === 'note').length,
  };

  // Recent activities (last 7 days)
  const weekAgo = new Date(now - 7 * 86400000).toISOString();
  const recentActivities = allActivities
    .filter(a => a.timestamp >= weekAgo)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)
    .map(a => {
      const contact = a.contact_id ? store.getContact(a.contact_id) : null;
      return { ...a, contact_name: contact ? contact.name : null };
    });

  // Monthly revenue (won deals by month)
  const monthlyRevenue = {};
  wonDeals.forEach(d => {
    const date = d.expected_close_date || d.updated_at.split('T')[0];
    const monthKey = date.substring(0, 7); // YYYY-MM
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + d.value;
  });

  // Pipeline funnel data
  const stages = store.pipelineStages;
  const funnelData = stages.map(stage => ({
    stage,
    count: allDeals.filter(d => d.stage === stage).length,
    value: allDeals.filter(d => d.stage === stage).reduce((sum, d) => sum + (d.value || 0), 0)
  }));

  // Win rate
  const lostDeals = allDeals.filter(d => d.stage === 'Closed Lost');
  const closedCount = wonDeals.length + lostDeals.length;
  const winRate = closedCount > 0 ? Math.round((wonDeals.length / closedCount) * 100) : 0;

  res.json({
    metrics: {
      activePipelineValue,
      totalWonValue,
      winRate,
      totalContacts: allContacts.length,
      totalCompanies: allCompanies.length,
      totalDeals: allDeals.length,
      dealsClosingThisMonth: dealsClosingThisMonth.length,
      dealsClosingThisMonthValue: dealsClosingThisMonth.reduce((s, d) => s + d.value, 0)
    },
    topContacts,
    activityStats,
    recentActivities,
    monthlyRevenue,
    funnelData
  });
});

module.exports = router;
