const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = mongoose;
