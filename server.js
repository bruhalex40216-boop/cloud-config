const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
  origin: '*', // Replace with your actual frontend URL e.g. 'https://keno.onrender.com'
}));

const LUARMOR_API_KEY = process.env.LUARMOR_API_KEY;
const LUARMOR_BASE = 'https://api.luarmor.net/v3';

// ── GET config for a user ──
// Frontend calls: GET /config?project_id=XXX&user_key=YYY
app.get('/config', async (req, res) => {
  const { project_id, user_key } = req.query;
  if (!project_id || !user_key) return res.status(400).json({ error: 'Missing project_id or user_key' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${project_id}/users/${user_key}`, {
      headers: { 'Authorization': LUARMOR_API_KEY }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── SAVE config for a user ──
// Frontend calls: POST /config with body { project_id, user_key, config }
app.post('/config', async (req, res) => {
  const { project_id, user_key, config } = req.body;
  if (!project_id || !user_key || !config) return res.status(400).json({ error: 'Missing fields' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${project_id}/users/${user_key}`, {
      method: 'PATCH',
      headers: {
        'Authorization': LUARMOR_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ note: config }) // Stored in Luarmor's "note" field
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET all users/keys for a project (so user can pick their key) ──
app.get('/users', async (req, res) => {
  const { project_id } = req.query;
  if (!project_id) return res.status(400).json({ error: 'Missing project_id' });

  try {
    const r = await fetch(`${LUARMOR_BASE}/projects/${project_id}/users`, {
      headers: { 'Authorization': LUARMOR_API_KEY }
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
