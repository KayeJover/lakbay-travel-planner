
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1";

// Get current weather for a destination
export async function getCurrentWeather(location) {
    if (!API_KEY) {
        throw new Error("WeatherAPI key is missing. Check your .env file.");
    }

    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "Unable to fetch current weather.");
    }

    return data;
}

// Get weather forecast for a destination
export async function getWeatherForecast(location, days = 3) {
    if (!API_KEY) {
        throw new Error("WeatherAPI key is missing. Check your .env file.");
    }

    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=${days}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "Unable to fetch weather forecast.");
    }

    return data;
}
