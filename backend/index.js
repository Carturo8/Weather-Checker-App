// Import required modules
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Define the port to run the server (use .env or fallback to 3000)
const PORT = process.env.PORT || 3000;

// Enable CORS for cross-origin requests (e.g., from GitHub Pages frontend)
app.use(cors());

/**
 * GET /weather
 * Fetches current weather data for a given city using OpenWeatherMap API.
 * Expects a query parameter: ?city=cityName
 */
app.get('/weather', async (req, res) => {
    const { city } = req.query;
    const apiKey = process.env.API_KEY;

    // Validate input
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Request weather data from OpenWeatherMap
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=es`
        );

        // Send successful response
        res.json(response.data);

    } catch (error) {
        // Handle errors (e.g., invalid city or API issues)
        res.status(500).json({ error: 'Weather data not found' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});