// API client
const API = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
    return res.json();
  },
  async post(path, data) {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `POST ${path}: ${res.status}`);
    return json;
  },
  async put(path, data) {
    const res = await fetch(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || `PUT ${path}: ${res.status}`);
    return json;
  },
  async del(path) {
    const res = await fetch(path, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE ${path}: ${res.status}`);
    return res.json();
  }
};

// Formatting helpers
function formatCurrency(value) {
  if (value == null) return '$0';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(dateStr);
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function stageBadgeClass(stage) {
  const map = { 'Lead': 'lead', 'Qualified': 'qualified', 'Proposal': 'proposal', 'Negotiation': 'negotiation', 'Closed Won': 'won', 'Closed Lost': 'lost' };
  return `badge badge-stage badge-stage-${map[stage] || 'lead'}`;
}

function statusBadgeClass(status) {
  return `badge badge-${status || 'lead'}`;
}

function probBadgeClass(prob) {
  if (prob >= 70) return 'probability-badge prob-high';
  if (prob >= 40) return 'probability-badge prob-medium';
  return 'probability-badge prob-low';
}

function activityIcon(type) {
  const icons = { call: '\u{1F4DE}', email: '\u{2709}', meeting: '\u{1F4C5}', note: '\u{1F4DD}' };
  return icons[type] || '\u{1F4CC}';
}
