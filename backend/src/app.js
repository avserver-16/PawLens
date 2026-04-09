const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const diagnosisRoutes = require('./routes/diagnosis.routes');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/diagnosis', diagnosisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PawLens API is running' });
});

module.exports = app;