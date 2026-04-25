
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Firebase Admin Setup (Assuming keys are provided in environment)
// admin.initializeApp({
//   credential: admin.credential.applicationDefault()
// });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hometiffin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
