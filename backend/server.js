const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BuzzTrip backend is running!');
});

app.get('/api/tours', (req, res) => {
  const dataPath = path.join(__dirname, 'data', 'tours.json');
  const tours = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  res.json(tours);
});

app.listen(PORT, () => {
  console.log(`✅ BuzzTrip backend running at http://localhost:${PORT}`);
});
