// var createError = require('http-errors');
var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const WEATHER_LINK = "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York"
const TIME_FOR_HUMIDITY = 19

// optimal weather conditions
// 55 to 80 degrees
// < 90% humidity
// < 10mph wind
// 0% precipitation
// clouds: clear, mostly clear, partly cloudy, overcast
function optCalc(WeatherData) {
    // 70, 80, 10, 0, partly cloudy
    const {temperature, humidity, wind, precipitation, weathercode} = WeatherData;
    if (temperature > 55 && temperature < 80
        && humidity < 90
        && wind < 10
        && precipitation === 0
        && (weathercode === 0 || weathercode === 1 || weathercode === 2 || weathercode === 3)) {
        return "this is peak piko weather"
    }
    return "kms"
}

let code = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog",
    48: "Depositing Rime Fog", 51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    56: "Light freezing drizzle", 56: "Dense freezing drizzle", 
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 
    66: "Light freezing rain", 67: "Heavy freezing rain", 
    71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall",
    77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers",
    85: "Slight snow showers", 86: "Heavy snow showers", 95: "Slight or moderate thunderstorm",
    96: "Slight hail thunderstorm", 99: "Heavy hail thunderstorm",
};

function formatWeatherData(WeatherData) {
    const {daily, hourly} = WeatherData;
    let formatted = [];

    for (day = 0; day < 7; day++) {
        formatted[day] = {};
        let dataCode = daily.weather_code[day];
        formatted[day].date = daily.time[day];
        formatted[day].temperature = daily.temperature_2m_max[day];
        formatted[day].humidity = hourly.relative_humidity_2m[(day * 24) + TIME_FOR_HUMIDITY];
        formatted[day].wind = daily.wind_speed_10m_max[day];
        formatted[day].precipitation = daily.precipitation_probability_max[day];
        formatted[day].weathercode = dataCode;
        const judgementForDay = optCalc(formatted[day])
        formatted[day].weathercode = code[dataCode];
        formatted[day].judgement = judgementForDay;
    }
    return formatted
}

app.get('/weather', async (req, res) => {
    // function to get data
    async function getWeather(link) {
        let xmlHttp = await fetch(link);
        if (xmlHttp.ok) {
            const data = await xmlHttp.json();
            return data;
        }
    }

    // use function to get data
    let wdata = await getWeather(WEATHER_LINK);

    // reformat data to something we like
    const formattedData = formatWeatherData(wdata);

    // send that data to the frontend
    res.send(formattedData);
})

module.exports = app;
