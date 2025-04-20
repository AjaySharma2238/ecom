const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Get data
app.get('/data.json', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            res.status(500).send('Error reading data file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Append new calculation to data.json
app.post('/data.json', (req, res) => {
    const newCalculation = req.body;

    fs.readFile('./data.json', 'utf8', (err, data) => {
        let jsonData;

        if (err) {
            res.status(500).send('Error reading data file');
            return;
        }

        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            // If JSON is invalid or empty, initialize it
            jsonData = { savedCalculations: [] };
        }

        jsonData.savedCalculations.push(newCalculation);

        fs.writeFile('./data.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error saving data');
            } else {
                res.status(200).send('Calculation saved successfully');
            }
        });
    });
});

// Update data (PUT request)
app.put('/data.json', (req, res) => {
    const updatedData = req.body;

    fs.writeFile('./data.json', JSON.stringify(updatedData, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to data file:', err);
            res.status(500).send('Error saving data');
        } else {
            res.status(200).send('Data updated successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});