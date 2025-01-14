import { NextResponse } from 'next/server';

const WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast?latitude=38.86&longitude=-77.63&hourly=relative_humidity_2m&daily=weather_code,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FNew_York';
//(universal timezone) "https://api.open-meteo.com/v1/forecast?latitude=38.86&longitude=-77.63&hourly=relative_humidity_2m&daily=weather_code,temperature_2m_max,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=GMT";
const TIME_FOR_HUMIDITY = 19;

function optCalc(WeatherData) {
  const { temperature, humidity, wind, precipitation, weathercode } = WeatherData;
  let tempWeight = 20;
  let humidWeight = 10;

  if (weathercode > 3) {
    return 'kms';
  }
  if (temperature < 50 || temperature > 90) {
    return 'kms';
  } else {
    tempWeight -= Math.abs(temperature - 70);
  }
  if (temperature > 65) {
    if (humidity > 50) {
      humidWeight -= humidity - 50;
    }
  } else {
    if (humidity > 70) {
      humidWeight -= (humidity - 70) / 2;
    }
  }
  if (humidWeight <= 0) {
    return 'kms';
  }
  if (wind > 10) {
    return 'kms';
  }
  if (precipitation > 0) {
    return 'kms';
  }

  const totWeight = tempWeight + humidWeight;

  if (totWeight > 10) {
    return 'this is peak piko weather';
  }
  return 'kms';
}

// Variable of objects to identify and return each day's weather code as a description
let code = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing Rime Fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  56: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Slight or moderate thunderstorm',
  96: 'Slight hail thunderstorm',
  99: 'Heavy hail thunderstorm',
};

// Formats the data in a more readable state
function formatWeatherData(WeatherData) {
  const { daily, hourly } = WeatherData;
  let formatted = [];

  for (let day = 0; day < 7; day++) {
    formatted[day] = {};
    let dataCode = daily.weather_code[day];
    formatted[day].date = daily.time[day];
    formatted[day].temperature = daily.temperature_2m_max[day];
    formatted[day].humidity = hourly.relative_humidity_2m[day * 24 + TIME_FOR_HUMIDITY];
    formatted[day].wind = daily.wind_speed_10m_max[day];
    formatted[day].precipitation = daily.precipitation_probability_max[day];
    formatted[day].weathercode = dataCode;
    const judgementForDay = optCalc(formatted[day]);
    formatted[day].weathercode = code[dataCode];
    formatted[day].judgement = judgementForDay;
  }
  return formatted;
}

// function to get data from a URL
export async function GET() {
  async function getWeather(link) {
    let res = await fetch(link, { cache: 'no-cache' });
    if (res.ok) {
      return await res.json();
    }
  }

  // use function to get data
  let wdata = await getWeather(WEATHER_URL);

  // reformat data to something we like
  const formattedData = formatWeatherData(wdata);

  // send that data to the frontend
  return NextResponse.json(formattedData);
}
