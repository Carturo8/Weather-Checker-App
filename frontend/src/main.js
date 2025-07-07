// Import libraries: axios for HTTP requests and Swal for styled alerts
import axios from "axios";
import Swal from 'sweetalert2';

// DOM element references
const form = document.getElementById("weatherForm");
const input = document.getElementById("cityName");
const resultSection = document.getElementById("weatherResult");
const cityTitle = document.getElementById("cityTitle");
const temperature = document.getElementById("temp");
const humiditySpan = document.getElementById("humidity");
const windSpeed = document.getElementById("wind");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const weatherIcon = document.getElementById("weatherIcon");

/**
 * Fetch weather data from OpenWeather API
 * @param {string} city - City name entered by user
 */
async function fetchWeather(city) {
    try {
        const url = `https://weather-backend-702a.onrender.com/weather?city=${encodeURIComponent(city)}`;
        const response = await axios.get(url);
        const data = response.data;

        // Destructure useful data from API response
        const { name } = data;
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        const { icon } = data.weather[0];
        const { sunrise: sunriseTime, sunset: sunsetTime } = data.sys;

        // Update UI with weather data
        cityTitle.textContent = name;
        temperature.textContent = temp.toFixed(1);
        humiditySpan.textContent = humidity;
        windSpeed.textContent = speed.toFixed(1);
        sunrise.textContent = new Date(sunriseTime * 1000).toLocaleTimeString();
        sunset.textContent = new Date(sunsetTime * 1000).toLocaleTimeString();
        weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        weatherIcon.alt = "Current weather icon";

        // Reveal the weather result section by removing the 'hidden' class
        resultSection.classList.remove("hidden");

        // Clear input and set focus again
        input.value = "";
        input.focus();

        // Trigger fade-in animation
        resultSection.classList.remove("updated"); // Reset animation if needed
        void resultSection.offsetWidth;            // Force reflow (trick to restart animation)
        resultSection.classList.add("updated");

    } catch (error) {
        // Show styled alert if the city is not found
        void Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'City not found. Please enter a valid city.',
            confirmButtonColor: '#2ecc71'
        });

        resultSection.classList.add("hidden");

        // Clear and focus input after the error
        input.value = "";
        input.focus();
    }
}

/**
 * Handle form submission and trigger weather fetch
 * @param {Event} event - Submit event
 */
function handleSearch(event) {
    event.preventDefault(); // Prevent page reload on form submission
    const city = input.value.trim();
    if (city !== "") {
        fetchWeather(city);
    }
}

// Listen for form submission (via button click or Enter key)
form.addEventListener("submit", handleSearch);