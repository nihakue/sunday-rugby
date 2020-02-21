const { get } = require('./httpUtils');
const { nextGameDateTime } = require('./util');
require('dotenv').config();

const EDINBURGH_ID = '2650225';
const BASE_API_URL = 'https://api.openweathermap.org/data/2.5'
const FIVE_DAY = '/forecast';
const N_DAY = '/forecast/daily';

const apiKey = process.env.WEATHER_API_KEY;
const baseParams = `&units=metric&appid=${apiKey}`
const MS_IN_DAY = 1000 * 60 * 60 * 24;
const FIVE_DAYS_IN_MS = MS_IN_DAY * 5;
const THREE_HOURS_IN_SECONDS = 60 * 60 * 3;
const SIXTEEN_DAYS_IN_MS = MS_IN_DAY * 16

function buildFiveDayRequest({cityId}) {
  return `${BASE_API_URL}${FIVE_DAY}?id=${cityId}${baseParams}`
}

function buildNDayRequest({cityId, n}) {
  return `${BASE_API_URL}${N_DAY}?id=${cityId}&cnt=${n}${baseParams}`
}

function processResponse(response) {
  const responseJson = JSON.parse(response);
  if (responseJson.cod !== '200') {
    throw Error(responseJson.message || 'There was an error, ', responseJson);
  }
  return responseJson;
}

function extractWeatherForDateTime(forecast, dateTime) {
  const forecastList = forecast.list;
  const epochSeconds = dateTime.getTime() / 1000;
  return forecastList.find((f, i) => {
    const prev = forecastList[i - 1];
    // TODO: There is a bug here when the first entry is the correct one. But without knowing if it's five day or 16 day forecast we can't resolve.
    return f.dt >= epochSeconds && prev && prev.dt < epochSeconds;
  });
}

function processWeather(rawWeather) {
  const { weather, temp, main, wind, speed } = rawWeather;
  return {
    description: weather[0].description,
    temp: temp ? temp.day : main.temp,
    wind: speed ? speed : wind.speed,
  }
}

function error() {
  throw Error('Can only get weather for dates up to 16 days in the future');
}

async function fiveDayForecast(cityId) {
  const response = await get(buildFiveDayRequest({cityId}));
  return processResponse(response);
}

async function nDayForecast(cityId, n) {
  if (n > 16) {
    throw Error('max 16 day forecast');
  }
  const response = await get(buildNDayRequest({cityId, n: n + 1}));
  return processResponse(response);
}

async function weatherForDate(dateTime, cityId=EDINBURGH_ID) {
  console.log(`Checking weather for ${cityId} at ${dateTime}`);
  const delta = dateTime.getTime() - Date.now();
  let weatherResponse;
  if (delta <= FIVE_DAYS_IN_MS) {
    weatherResponse = await fiveDayForecast(cityId);
  } else if (delta <= SIXTEEN_DAYS_IN_MS) {
    weatherResponse = await nDayForecast(cityId, Math.ceil (delta / MS_IN_DAY))
  }
  if (!weatherResponse) {
    error();
  }
  return processWeather(extractWeatherForDateTime(weatherResponse, dateTime));
}

function formatWeatherString(weather) {
  return `Forecast is for: "${weather.description}". Wind: ${(weather.wind * 2.237).toFixed(2)} mph. Temp: ${weather.temp} °C`
}

// (async function() {
//   console.log(formatWeatherString(await weatherForDate(nextGameDateTime())));
// })()


module.exports = {
  weatherForDate,
  formatWeatherString,
}