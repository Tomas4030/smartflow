const express = require('express');
const cors    = require('cors');

const auth   = require('./middleware/auth');
const app    = express();
const PORT   = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// ── Routes ─────────────────────────────────────────────────────
// app.use('/api/auth',           require('./routes/auth'));           // card 3.1
// app.use('/api/municipalities', require('./routes/municipalities')); // card 3.1
// app.use('/api/intersections',  auth, require('./routes/intersections')); // card 3.2

app.use('/api/events', auth, require('./routes/events'));             

// ── 404 handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`SmartFlow API running on port ${PORT}`);
});