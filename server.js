const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to allow CORS for your frontend
app.use(cors());

// Root POST route (/) to handle incoming data
app.post('/', async (req, res) => {
    try {
        // Replace with your Google Apps Script URL
        const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgzsJUD7Di5S5vNMTAjgdWzuRp4IzKIQOCfo4N1H0PvxNacammvCfbNKjEL8RvdKzF/exec';

        // Log incoming request for debugging
        console.log('Received POST request:', req.body);

        // Forward data to Google Apps Script
        const response = await axios.post(GOOGLE_APPS_SCRIPT_URL, req.body, {
            headers: { 'Content-Type': 'application/json' },
        });

        // Log the response from Google Apps Script
        console.log('Google Apps Script response:', response.data);

        // Send the response back to the client
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error while sending data to Google Apps Script:', error);

        // Handle Axios errors
        if (error.response) {
            console.error('Google Apps Script error response:', error.response.data);
            res.status(error.response.status).json({
                success: false,
                message: error.response.data,
            });
        } else if (error.request) {
            console.error('No response received from Google Apps Script:', error.request);
            res.status(500).json({
                success: false,
                message: 'No response from Google Apps Script. Please try again later.',
            });
        } else {
            res.status(500).json({
                success: false,
                message: `Unexpected error: ${error.message}`,
            });
        }
    }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
