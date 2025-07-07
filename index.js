const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load data
const dataPath = path.join(__dirname, 'data.json');
const wimbledonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint
app.get('/wimbledon', (req, res) => {
  try {
    // Validate year parameter
    const year = parseInt(req.query.year);
    if (!year || isNaN(year)) {
      return res.status(400).json({
        error: 'Invalid year parameter',
        message: 'Please provide a valid year as a number'
      });
    }

    // Find matching final
    const final = wimbledonData.find(match => match.year === year);
    
    if (!final) {
      return res.status(404).json({
        error: 'Not found',
        message: `No Wimbledon final found for year ${year}`
      });
    }

    // Return successful response
    res.json(final);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong while processing your request'
    });
  }
});

app.get('/', (req, res) => {
  res.send('Wimbledon API is live! Use /wimbledon?year=2021');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/wimbledon?year=2021`);
});