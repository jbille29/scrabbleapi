require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./routes/userRoutes');
const letterPoolRoutes = require('./routes/letterPoolRoutes'); // Letter Pool Game Routes

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const MONGO_URI = process.env.MONGO_URI;

const app = express();

// ✅ Middleware Setup
app.use(cors()); // Allow all origins
app.use(express.json());
app.use(helmet()); // Secure Headers
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 100 })); // 100 requests per min

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use('/api/users', userRoutes);
app.use('/api/letterpool', letterPoolRoutes); // Letter Pool Game API

// ✅ Start Server
app.listen(PORT, HOST, () => console.log(`🚀 Server running on http://${HOST}:${PORT}`));