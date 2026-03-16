const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

const LUARMOR_API_KEY = process.env.LUARMOR_API_KEY;
const PROJECT_ID = 'ca9a1a52dfadc912c1628841aaaa2ecc';
const LUARMOR_BASE = 'https://api.luarmor.net/v3';

// ── VERIFY a user's script key ──
// Returns { valid: true, user } or { valid: false }
app.post('/verify', async (req, res) => {
  const { user_key } = req.body;
  if (!user_key) return res.status(400).json({ valid: false, error: 'Missing user_key' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${PROJECT_ID}/users/${user_key}`, {
      headers: { 'Authorization': LUARMOR_API_KEY }
    });
    if (r.status === 404) return res.json({ valid: false, error: 'Invalid key' });
    const data = await r.json();
    if (data.error) return res.json({ valid: false, error: data.error });
    res.json({ valid: true, user: data });
  } catch (e) {
    res.status(500).json({ valid: false, error: e.message });
  }
});

// ── GET config for a user ──
app.get('/config', async (req, res) => {
  const { user_key } = req.query;
  if (!user_key) return res.status(400).json({ error: 'Missing user_key' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${PROJECT_ID}/users/${user_key}`, {
      headers: { 'Authorization': LUARMOR_API_KEY }
    });
    const data = await r.json();
    // Config is stored in the note field
    res.json({ config: data.note || null, user: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── SAVE config for a user ──
app.post('/config', async (req, res) => {
  const { user_key, config } = req.body;
  if (!user_key || !config) return res.status(400).json({ error: 'Missing fields' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${PROJECT_ID}/users/${user_key}`, {
      method: 'PATCH',
      headers: {
        'Authorization': LUARMOR_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note: config })
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/', (req, res) => res.json({ status: 'keno backend running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
