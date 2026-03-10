const store = require('./store');

function seed() {
  // Clear existing data
  store.contacts.clear();
  store.companies.clear();
  store.deals.clear();
  store.activities.clear();
  store.dealHistory.clear();

  // --- 5 Companies ---
  const companies = [
    store.createCompany({ name: 'Acme Technologies', domain: 'acmetech.com', industry: 'Technology', size: '51-200', revenue: 12000000 }),
    store.createCompany({ name: 'Global Finance Corp', domain: 'globalfinancecorp.com', industry: 'Financial Services', size: '201-500', revenue: 85000000 }),
    store.createCompany({ name: 'Bright Health Systems', domain: 'brighthealth.io', industry: 'Healthcare', size: '11-50', revenue: 4500000 }),
    store.createCompany({ name: 'Summit Retail Group', domain: 'summitretail.com', industry: 'Retail', size: '501-1000', revenue: 150000000 }),
    store.createCompany({ name: 'Nova Creative Agency', domain: 'novacreative.co', industry: 'Marketing', size: '1-10', revenue: 800000 }),
  ];

  // --- 15 Contacts ---
  const contacts = [
    store.createContact({ name: 'Sarah Chen', email: 'sarah.chen@acmetech.com', phone: '(415) 555-0101', company: 'Acme Technologies', company_id: companies[0].id, title: 'VP of Engineering', tags: ['decision-maker', 'technical'], status: 'customer', notes: 'Key stakeholder for platform integration project.' }),
    store.createContact({ name: 'Marcus Johnson', email: 'marcus.j@acmetech.com', phone: '(415) 555-0102', company: 'Acme Technologies', company_id: companies[0].id, title: 'CTO', tags: ['c-suite', 'technical'], status: 'customer', notes: 'Reports directly to CEO. Interested in AI capabilities.' }),
    store.createContact({ name: 'Emily Rodriguez', email: 'emily.r@globalfinancecorp.com', phone: '(212) 555-0201', company: 'Global Finance Corp', company_id: companies[1].id, title: 'Director of Operations', tags: ['decision-maker'], status: 'prospect', notes: 'Looking to modernize their internal tools.' }),
    store.createContact({ name: 'David Park', email: 'dpark@globalfinancecorp.com', phone: '(212) 555-0202', company: 'Global Finance Corp', company_id: companies[1].id, title: 'Senior Analyst', tags: ['end-user', 'champion'], status: 'prospect', notes: 'Internal champion. Will drive adoption.' }),
    store.createContact({ name: 'Rachel Kim', email: 'rachel@globalfinancecorp.com', phone: '(212) 555-0203', company: 'Global Finance Corp', company_id: companies[1].id, title: 'CFO', tags: ['c-suite', 'budget-holder'], status: 'lead', notes: 'Budget approval authority. Needs ROI justification.' }),
    store.createContact({ name: 'James Liu', email: 'james@brighthealth.io', phone: '(617) 555-0301', company: 'Bright Health Systems', company_id: companies[2].id, title: 'CEO & Founder', tags: ['c-suite', 'decision-maker'], status: 'prospect', notes: 'Startup founder, moving fast. Needs HIPAA compliance.' }),
    store.createContact({ name: 'Amanda Foster', email: 'amanda@brighthealth.io', phone: '(617) 555-0302', company: 'Bright Health Systems', company_id: companies[2].id, title: 'Product Manager', tags: ['technical', 'end-user'], status: 'lead', notes: 'Evaluating multiple vendors.' }),
    store.createContact({ name: 'Thomas Wright', email: 'twright@summitretail.com', phone: '(312) 555-0401', company: 'Summit Retail Group', company_id: companies[3].id, title: 'VP of Sales', tags: ['decision-maker', 'sales'], status: 'customer', notes: 'Existing customer. Interested in expanding license.' }),
    store.createContact({ name: 'Lisa Chang', email: 'lisa.chang@summitretail.com', phone: '(312) 555-0402', company: 'Summit Retail Group', company_id: companies[3].id, title: 'IT Director', tags: ['technical', 'integration'], status: 'customer', notes: 'Manages their technical infrastructure.' }),
    store.createContact({ name: 'Michael Torres', email: 'mtorres@summitretail.com', phone: '(312) 555-0403', company: 'Summit Retail Group', company_id: companies[3].id, title: 'Regional Manager', tags: ['end-user'], status: 'prospect', notes: 'Interested in mobile features for field team.' }),
    store.createContact({ name: 'Jennifer Walsh', email: 'jen@novacreative.co', phone: '(310) 555-0501', company: 'Nova Creative Agency', company_id: companies[4].id, title: 'Creative Director', tags: ['decision-maker'], status: 'lead', notes: 'Small agency looking for lightweight CRM.' }),
    store.createContact({ name: 'Robert Stevens', email: 'rob@novacreative.co', phone: '(310) 555-0502', company: 'Nova Creative Agency', company_id: companies[4].id, title: 'Account Manager', tags: ['end-user', 'champion'], status: 'lead', notes: 'Would be the primary daily user.' }),
    store.createContact({ name: 'Priya Sharma', email: 'priya.sharma@outlook.com', phone: '(503) 555-0601', company: '', company_id: null, title: 'Independent Consultant', tags: ['freelancer'], status: 'churned', notes: 'Was interested, went with a competitor. Follow up in Q3.' }),
    store.createContact({ name: 'Alex Nguyen', email: 'alex.nguyen@gmail.com', phone: '(408) 555-0701', company: '', company_id: null, title: 'Startup Founder', tags: ['startup', 'technical'], status: 'lead', notes: 'Pre-seed startup. Needs affordable solution.' }),
    store.createContact({ name: 'Catherine Brooks', email: 'cbrooks@outlook.com', phone: '(202) 555-0801', company: '', company_id: null, title: 'Freelance Designer', tags: ['freelancer', 'design'], status: 'lead', notes: 'Referred by Jennifer Walsh at Nova Creative.' }),
  ];

  // --- 10 Deals ---
  const now = new Date();
  const daysAgo = (n) => new Date(now - n * 86400000).toISOString().split('T')[0];
  const daysFromNow = (n) => new Date(now.getTime() + n * 86400000).toISOString().split('T')[0];

  const deals = [
    store.createDeal({ title: 'Acme Platform Integration', value: 75000, stage: 'Closed Won', probability: 100, expected_close_date: daysAgo(10), contact_id: contacts[0].id, company_id: companies[0].id, notes: 'Annual platform license. Signed last week.' }),
    store.createDeal({ title: 'Acme AI Add-on Module', value: 25000, stage: 'Proposal', probability: 60, expected_close_date: daysFromNow(30), contact_id: contacts[1].id, company_id: companies[0].id, notes: 'AI features expansion. Waiting on technical review.' }),
    store.createDeal({ title: 'Global Finance Operations Suite', value: 250000, stage: 'Negotiation', probability: 75, expected_close_date: daysFromNow(15), contact_id: contacts[2].id, company_id: companies[1].id, notes: 'Large enterprise deal. Legal review in progress.' }),
    store.createDeal({ title: 'Global Finance Analytics Dashboard', value: 45000, stage: 'Qualified', probability: 40, expected_close_date: daysFromNow(60), contact_id: contacts[3].id, company_id: companies[1].id, notes: 'Secondary project. Depends on Operations Suite deal.' }),
    store.createDeal({ title: 'Bright Health Patient Portal', value: 35000, stage: 'Proposal', probability: 50, expected_close_date: daysFromNow(45), contact_id: contacts[5].id, company_id: companies[2].id, notes: 'HIPAA-compliant patient portal. Compliance review needed.' }),
    store.createDeal({ title: 'Summit Retail License Expansion', value: 120000, stage: 'Negotiation', probability: 80, expected_close_date: daysFromNow(7), contact_id: contacts[7].id, company_id: companies[3].id, notes: 'Expanding from 50 to 200 seats. Pricing discussion.' }),
    store.createDeal({ title: 'Summit Mobile App', value: 60000, stage: 'Lead', probability: 20, expected_close_date: daysFromNow(90), contact_id: contacts[9].id, company_id: companies[3].id, notes: 'Early exploration. Mobile app for field sales team.' }),
    store.createDeal({ title: 'Nova Creative CRM Setup', value: 8000, stage: 'Qualified', probability: 45, expected_close_date: daysFromNow(21), contact_id: contacts[10].id, company_id: companies[4].id, notes: 'Small deal. Lightweight setup for 5-person agency.' }),
    store.createDeal({ title: 'Enterprise Training Package', value: 15000, stage: 'Closed Won', probability: 100, expected_close_date: daysAgo(25), contact_id: contacts[7].id, company_id: companies[3].id, notes: 'Training for Summit Retail team. Completed.' }),
    store.createDeal({ title: 'Startup Starter Plan', value: 2400, stage: 'Closed Lost', probability: 0, expected_close_date: daysAgo(5), contact_id: contacts[13].id, company_id: null, notes: 'Lost to competitor. Price was the deciding factor.' }),
  ];

  // --- 30 Activities ---
  const activityData = [
    { type: 'call', subject: 'Discovery call with Sarah', description: 'Discussed integration requirements and timeline. Sarah wants to start in Q2.', contact_id: contacts[0].id, deal_id: deals[0].id, timestamp: new Date(now - 30 * 86400000).toISOString() },
    { type: 'email', subject: 'Sent proposal to Sarah Chen', description: 'Sent the platform integration proposal with pricing tiers.', contact_id: contacts[0].id, deal_id: deals[0].id, timestamp: new Date(now - 25 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Technical deep dive with Acme team', description: 'Met with Sarah and Marcus to review API capabilities. Demo went well.', contact_id: contacts[0].id, deal_id: deals[0].id, timestamp: new Date(now - 20 * 86400000).toISOString() },
    { type: 'note', subject: 'Contract signed - Acme Platform', description: 'Sarah signed the annual contract. Implementation starts next week.', contact_id: contacts[0].id, deal_id: deals[0].id, timestamp: new Date(now - 10 * 86400000).toISOString() },
    { type: 'call', subject: 'Intro call with Marcus Johnson', description: 'Marcus interested in AI capabilities for their dev pipeline.', contact_id: contacts[1].id, deal_id: deals[1].id, timestamp: new Date(now - 15 * 86400000).toISOString() },
    { type: 'email', subject: 'AI module overview sent', description: 'Sent product brief and case studies for AI add-on module.', contact_id: contacts[1].id, deal_id: deals[1].id, timestamp: new Date(now - 12 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Global Finance initial meeting', description: 'Met Emily and David at their office. Large opportunity for operations modernization.', contact_id: contacts[2].id, deal_id: deals[2].id, timestamp: new Date(now - 45 * 86400000).toISOString() },
    { type: 'call', subject: 'Follow-up with Emily Rodriguez', description: 'Discussed security requirements and compliance needs.', contact_id: contacts[2].id, deal_id: deals[2].id, timestamp: new Date(now - 35 * 86400000).toISOString() },
    { type: 'email', subject: 'Proposal sent to Global Finance', description: 'Sent comprehensive proposal including implementation timeline.', contact_id: contacts[2].id, deal_id: deals[2].id, timestamp: new Date(now - 28 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Negotiation meeting with Global Finance', description: 'Met with Emily and legal team. Discussing contract terms.', contact_id: contacts[2].id, deal_id: deals[2].id, timestamp: new Date(now - 7 * 86400000).toISOString() },
    { type: 'call', subject: 'David Park - analytics needs', description: 'David wants a dashboard for real-time reporting. Could be a separate deal.', contact_id: contacts[3].id, deal_id: deals[3].id, timestamp: new Date(now - 20 * 86400000).toISOString() },
    { type: 'note', subject: 'Rachel Kim budget concerns', description: 'Rachel needs detailed ROI analysis before approving the budget.', contact_id: contacts[4].id, deal_id: deals[2].id, timestamp: new Date(now - 14 * 86400000).toISOString() },
    { type: 'call', subject: 'James Liu intro call', description: 'Fast-moving founder. Needs HIPAA-compliant solution ASAP.', contact_id: contacts[5].id, deal_id: deals[4].id, timestamp: new Date(now - 22 * 86400000).toISOString() },
    { type: 'email', subject: 'HIPAA compliance docs sent', description: 'Sent our HIPAA compliance documentation and SOC2 certification.', contact_id: contacts[5].id, deal_id: deals[4].id, timestamp: new Date(now - 18 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Product demo for Bright Health', description: 'Showed patient portal features. James was impressed but Amanda had concerns about UX.', contact_id: contacts[5].id, deal_id: deals[4].id, timestamp: new Date(now - 10 * 86400000).toISOString() },
    { type: 'call', subject: 'Amanda Foster follow-up', description: 'Addressed her UX concerns. Offered customization options.', contact_id: contacts[6].id, deal_id: deals[4].id, timestamp: new Date(now - 5 * 86400000).toISOString() },
    { type: 'email', subject: 'Renewal discussion with Thomas', description: 'Thomas wants to expand their license. Setting up a meeting.', contact_id: contacts[7].id, deal_id: deals[5].id, timestamp: new Date(now - 14 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Summit Retail expansion meeting', description: 'Met with Thomas and Lisa to discuss scaling from 50 to 200 seats.', contact_id: contacts[7].id, deal_id: deals[5].id, timestamp: new Date(now - 8 * 86400000).toISOString() },
    { type: 'call', subject: 'Pricing negotiation - Summit', description: 'Discussed volume discount pricing. Thomas pushing for 15% discount.', contact_id: contacts[7].id, deal_id: deals[5].id, timestamp: new Date(now - 3 * 86400000).toISOString() },
    { type: 'note', subject: 'Lisa Chang integration notes', description: 'Lisa needs API access for their inventory system integration.', contact_id: contacts[8].id, deal_id: deals[5].id, timestamp: new Date(now - 6 * 86400000).toISOString() },
    { type: 'call', subject: 'Michael Torres - mobile needs', description: 'Michael wants mobile app for field sales team. Early exploration.', contact_id: contacts[9].id, deal_id: deals[6].id, timestamp: new Date(now - 10 * 86400000).toISOString() },
    { type: 'email', subject: 'Mobile app capabilities overview', description: 'Sent overview of our mobile app features and pricing.', contact_id: contacts[9].id, deal_id: deals[6].id, timestamp: new Date(now - 7 * 86400000).toISOString() },
    { type: 'call', subject: 'Jennifer Walsh intro', description: 'Jennifer found us through a referral. Small agency looking for simple CRM.', contact_id: contacts[10].id, deal_id: deals[7].id, timestamp: new Date(now - 12 * 86400000).toISOString() },
    { type: 'email', subject: 'Starter plan info sent to Nova', description: 'Sent pricing for 5-person team. Very affordable tier.', contact_id: contacts[10].id, deal_id: deals[7].id, timestamp: new Date(now - 9 * 86400000).toISOString() },
    { type: 'meeting', subject: 'Summit training kickoff', description: 'Started training program for Summit Retail team. 3 sessions planned.', contact_id: contacts[7].id, deal_id: deals[8].id, timestamp: new Date(now - 30 * 86400000).toISOString() },
    { type: 'note', subject: 'Training completed - Summit', description: 'All 3 training sessions completed successfully. Good feedback.', contact_id: contacts[7].id, deal_id: deals[8].id, timestamp: new Date(now - 25 * 86400000).toISOString() },
    { type: 'call', subject: 'Alex Nguyen intro', description: 'Pre-seed startup founder. Very price-sensitive.', contact_id: contacts[13].id, deal_id: deals[9].id, timestamp: new Date(now - 20 * 86400000).toISOString() },
    { type: 'email', subject: 'Pricing comparison sent', description: 'Sent our startup pricing vs competitors.', contact_id: contacts[13].id, deal_id: deals[9].id, timestamp: new Date(now - 15 * 86400000).toISOString() },
    { type: 'note', subject: 'Lost deal - Alex went with competitor', description: 'Alex chose a cheaper alternative. Price was the main factor.', contact_id: contacts[13].id, deal_id: deals[9].id, timestamp: new Date(now - 5 * 86400000).toISOString() },
    { type: 'email', subject: 'Catherine Brooks referral follow-up', description: 'Jennifer referred Catherine. Sent intro email with portfolio.', contact_id: contacts[14].id, deal_id: null, timestamp: new Date(now - 3 * 86400000).toISOString() },
  ];

  activityData.forEach(a => store.createActivity(a));

  return {
    contacts: contacts.length,
    companies: companies.length,
    deals: deals.length,
    activities: activityData.length
  };
}

module.exports = { seed };
