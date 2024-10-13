const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;


app.use(express.json());
app.use(cors());


const dataFilePath = './formData.json';


app.post('/save', (req, res) => {
  const { dynamicFields } = req.body;

 
  fs.writeFile(dataFilePath, JSON.stringify({ dynamicFields }, null, 2), (err) => {
    if (err) {
      console.error('Error saving form data:', err);
      return res.status(500).json({ message: 'Failed to save form data' });
    }
    res.json({ message: 'Form data saved successfully!' });
  });
});

app.get('/formData', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading form data:', err);
      return res.status(500).json({ message: 'Failed to retrieve form data' });
    }

    const formData = JSON.parse(data);
    res.json(formData);
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
