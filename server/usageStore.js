const fs = require('fs');
const path = require('path');

const USAGE_FILE = path.join(__dirname, 'usage.json');

function ensureFile() {
  if (!fs.existsSync(USAGE_FILE)) {
    fs.writeFileSync(USAGE_FILE, JSON.stringify({}, null, 2));
  }
}

function readUsage() {
  ensureFile();
  try {
    const raw = fs.readFileSync(USAGE_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

function writeUsage(data) {
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
}

function getPeriodKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

function getUserUsage(userId, date = new Date()) {
  const db = readUsage();
  const period = getPeriodKey(date);
  const user = (db[period] && db[period][userId]) || { generations: 0, tokens: 0 };
  return { period, ...user };
}

function incrementUserUsage(userId, { generations = 0, tokens = 0 } = {}) {
  const db = readUsage();
  const period = getPeriodKey();
  if (!db[period]) db[period] = {};
  if (!db[period][userId]) db[period][userId] = { generations: 0, tokens: 0 };
  db[period][userId].generations += generations;
  db[period][userId].tokens += tokens;
  writeUsage(db);
  return { period, ...db[period][userId] };
}

module.exports = {
  getPeriodKey,
  getUserUsage,
  incrementUserUsage,
};
