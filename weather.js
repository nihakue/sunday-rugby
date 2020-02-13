const { get } = require('./httpUtils');
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

const TEST_RESPONSE = '{"cod":"200","message":0,"cnt":40,"list":[{"dt":1581368400,"main":{"temp":273.99,"feels_like":263.93,"temp_min":273.99,"temp_max":275.67,"pressure":979,"sea_level":979,"grnd_level":972,"humidity":91,"temp_kf":-1.68},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":50},"wind":{"speed":11.44,"deg":255},"rain":{"3h":2.94},"sys":{"pod":"n"},"dt_txt":"2020-02-10 21:00:00"},{"dt":1581379200,"main":{"temp":276.45,"feels_like":266.98,"temp_min":276.45,"temp_max":277.71,"pressure":982,"sea_level":982,"grnd_level":976,"humidity":72,"temp_kf":-1.26},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":50},"wind":{"speed":10.44,"deg":257},"rain":{"3h":0.69},"sys":{"pod":"n"},"dt_txt":"2020-02-11 00:00:00"},{"dt":1581390000,"main":{"temp":276.48,"feels_like":265.69,"temp_min":276.48,"temp_max":277.32,"pressure":984,"sea_level":984,"grnd_level":977,"humidity":74,"temp_kf":-0.84},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":62},"wind":{"speed":12.4,"deg":252},"sys":{"pod":"n"},"dt_txt":"2020-02-11 03:00:00"},{"dt":1581400800,"main":{"temp":276.24,"feels_like":262.87,"temp_min":276.24,"temp_max":276.66,"pressure":987,"sea_level":987,"grnd_level":980,"humidity":71,"temp_kf":-0.42},"weather":[{"id":601,"main":"Snow","description":"snow","icon":"13n"}],"clouds":{"all":75},"wind":{"speed":15.93,"deg":262},"snow":{"3h":1.81},"sys":{"pod":"n"},"dt_txt":"2020-02-11 06:00:00"},{"dt":1581411600,"main":{"temp":275.9,"feels_like":263.22,"temp_min":275.9,"temp_max":275.9,"pressure":989,"sea_level":989,"grnd_level":983,"humidity":67,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":74},"wind":{"speed":14.75,"deg":259},"sys":{"pod":"d"},"dt_txt":"2020-02-11 09:00:00"},{"dt":1581422400,"main":{"temp":276.84,"feels_like":263.96,"temp_min":276.84,"temp_max":276.84,"pressure":991,"sea_level":991,"grnd_level":984,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":40},"wind":{"speed":15.01,"deg":261},"sys":{"pod":"d"},"dt_txt":"2020-02-11 12:00:00"},{"dt":1581433200,"main":{"temp":276.66,"feels_like":263.5,"temp_min":276.66,"temp_max":276.66,"pressure":991,"sea_level":991,"grnd_level":985,"humidity":64,"temp_kf":0},"weather":[{"id":600,"main":"Snow","description":"light snow","icon":"13d"}],"clouds":{"all":48},"wind":{"speed":15.46,"deg":262},"snow":{"3h":0.25},"sys":{"pod":"d"},"dt_txt":"2020-02-11 15:00:00"},{"dt":1581444000,"main":{"temp":276.33,"feels_like":262.95,"temp_min":276.33,"temp_max":276.33,"pressure":992,"sea_level":992,"grnd_level":985,"humidity":63,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":40},"wind":{"speed":15.68,"deg":254},"sys":{"pod":"n"},"dt_txt":"2020-02-11 18:00:00"},{"dt":1581454800,"main":{"temp":276.37,"feels_like":262.78,"temp_min":276.37,"temp_max":276.37,"pressure":994,"sea_level":994,"grnd_level":987,"humidity":63,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":31},"wind":{"speed":15.99,"deg":263},"sys":{"pod":"n"},"dt_txt":"2020-02-11 21:00:00"},{"dt":1581465600,"main":{"temp":276.21,"feels_like":263.78,"temp_min":276.21,"temp_max":276.21,"pressure":996,"sea_level":996,"grnd_level":990,"humidity":64,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":27},"wind":{"speed":14.33,"deg":262},"sys":{"pod":"n"},"dt_txt":"2020-02-12 00:00:00"},{"dt":1581476400,"main":{"temp":276.25,"feels_like":264.33,"temp_min":276.25,"temp_max":276.25,"pressure":997,"sea_level":997,"grnd_level":991,"humidity":62,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":4},"wind":{"speed":13.55,"deg":264},"sys":{"pod":"n"},"dt_txt":"2020-02-12 03:00:00"},{"dt":1581487200,"main":{"temp":275.9,"feels_like":265.71,"temp_min":275.9,"temp_max":275.9,"pressure":1000,"sea_level":1000,"grnd_level":993,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":34},"wind":{"speed":11.01,"deg":263},"sys":{"pod":"n"},"dt_txt":"2020-02-12 06:00:00"},{"dt":1581498000,"main":{"temp":275.83,"feels_like":267.11,"temp_min":275.83,"temp_max":275.83,"pressure":1003,"sea_level":1003,"grnd_level":996,"humidity":62,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04d"}],"clouds":{"all":61},"wind":{"speed":8.91,"deg":255},"sys":{"pod":"d"},"dt_txt":"2020-02-12 09:00:00"},{"dt":1581508800,"main":{"temp":277.53,"feels_like":267.6,"temp_min":277.53,"temp_max":277.53,"pressure":1005,"sea_level":1005,"grnd_level":998,"humidity":57,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":30},"wind":{"speed":10.71,"deg":264},"sys":{"pod":"d"},"dt_txt":"2020-02-12 12:00:00"},{"dt":1581519600,"main":{"temp":277.44,"feels_like":268.6,"temp_min":277.44,"temp_max":277.44,"pressure":1006,"sea_level":1006,"grnd_level":999,"humidity":60,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02d"}],"clouds":{"all":18},"wind":{"speed":9.26,"deg":259},"sys":{"pod":"d"},"dt_txt":"2020-02-12 15:00:00"},{"dt":1581530400,"main":{"temp":275.72,"feels_like":268.93,"temp_min":275.72,"temp_max":275.72,"pressure":1007,"sea_level":1007,"grnd_level":1000,"humidity":71,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":34},"wind":{"speed":6.44,"deg":236},"sys":{"pod":"n"},"dt_txt":"2020-02-12 18:00:00"},{"dt":1581541200,"main":{"temp":275.1,"feels_like":269.51,"temp_min":275.1,"temp_max":275.1,"pressure":1006,"sea_level":1006,"grnd_level":1000,"humidity":78,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":67},"wind":{"speed":4.85,"deg":217},"sys":{"pod":"n"},"dt_txt":"2020-02-12 21:00:00"},{"dt":1581552000,"main":{"temp":274.79,"feels_like":270.42,"temp_min":274.79,"temp_max":274.79,"pressure":1004,"sea_level":1004,"grnd_level":998,"humidity":80,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":52},"wind":{"speed":3.12,"deg":196},"sys":{"pod":"n"},"dt_txt":"2020-02-13 00:00:00"},{"dt":1581562800,"main":{"temp":274.78,"feels_like":269.88,"temp_min":274.78,"temp_max":274.78,"pressure":1002,"sea_level":1002,"grnd_level":995,"humidity":86,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":4.07,"deg":150},"sys":{"pod":"n"},"dt_txt":"2020-02-13 03:00:00"},{"dt":1581573600,"main":{"temp":275,"feels_like":270.16,"temp_min":275,"temp_max":275,"pressure":998,"sea_level":998,"grnd_level":991,"humidity":85,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":3.99,"deg":106},"sys":{"pod":"n"},"dt_txt":"2020-02-13 06:00:00"},{"dt":1581584400,"main":{"temp":275.58,"feels_like":270.71,"temp_min":275.58,"temp_max":275.58,"pressure":995,"sea_level":995,"grnd_level":990,"humidity":85,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":4.15,"deg":103},"sys":{"pod":"d"},"dt_txt":"2020-02-13 09:00:00"},{"dt":1581595200,"main":{"temp":277.19,"feels_like":270.52,"temp_min":277.19,"temp_max":277.19,"pressure":995,"sea_level":995,"grnd_level":989,"humidity":91,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":7.31,"deg":89},"rain":{"3h":0.94},"sys":{"pod":"d"},"dt_txt":"2020-02-13 12:00:00"},{"dt":1581606000,"main":{"temp":278.18,"feels_like":272.62,"temp_min":278.18,"temp_max":278.18,"pressure":996,"sea_level":996,"grnd_level":991,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":5.65,"deg":38},"rain":{"3h":0.44},"sys":{"pod":"d"},"dt_txt":"2020-02-13 15:00:00"},{"dt":1581616800,"main":{"temp":277.36,"feels_like":273.32,"temp_min":277.36,"temp_max":277.36,"pressure":1000,"sea_level":1000,"grnd_level":995,"humidity":89,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":3.52,"deg":25},"rain":{"3h":0.44},"sys":{"pod":"n"},"dt_txt":"2020-02-13 18:00:00"},{"dt":1581627600,"main":{"temp":277.13,"feels_like":273.5,"temp_min":277.13,"temp_max":277.13,"pressure":1004,"sea_level":1004,"grnd_level":998,"humidity":86,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":73},"wind":{"speed":2.76,"deg":4},"sys":{"pod":"n"},"dt_txt":"2020-02-13 21:00:00"},{"dt":1581638400,"main":{"temp":276.44,"feels_like":274.07,"temp_min":276.44,"temp_max":276.44,"pressure":1006,"sea_level":1006,"grnd_level":999,"humidity":83,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":75},"wind":{"speed":0.69,"deg":28},"sys":{"pod":"n"},"dt_txt":"2020-02-14 00:00:00"},{"dt":1581649200,"main":{"temp":276.37,"feels_like":274.04,"temp_min":276.37,"temp_max":276.37,"pressure":1006,"sea_level":1006,"grnd_level":1000,"humidity":84,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.66,"deg":77},"sys":{"pod":"n"},"dt_txt":"2020-02-14 03:00:00"},{"dt":1581660000,"main":{"temp":276.52,"feels_like":272.33,"temp_min":276.52,"temp_max":276.52,"pressure":1005,"sea_level":1005,"grnd_level":999,"humidity":88,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":3.49,"deg":133},"sys":{"pod":"n"},"dt_txt":"2020-02-14 06:00:00"},{"dt":1581670800,"main":{"temp":277.26,"feels_like":270.47,"temp_min":277.26,"temp_max":277.26,"pressure":1002,"sea_level":1002,"grnd_level":996,"humidity":77,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":6.96,"deg":140},"sys":{"pod":"d"},"dt_txt":"2020-02-14 09:00:00"},{"dt":1581681600,"main":{"temp":278.43,"feels_like":269.88,"temp_min":278.43,"temp_max":278.43,"pressure":996,"sea_level":996,"grnd_level":990,"humidity":71,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":9.47,"deg":151},"sys":{"pod":"d"},"dt_txt":"2020-02-14 12:00:00"},{"dt":1581692400,"main":{"temp":279.47,"feels_like":271.94,"temp_min":279.47,"temp_max":279.47,"pressure":990,"sea_level":990,"grnd_level":984,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":8.78,"deg":177},"rain":{"3h":1.19},"sys":{"pod":"d"},"dt_txt":"2020-02-14 15:00:00"},{"dt":1581703200,"main":{"temp":279.31,"feels_like":272.44,"temp_min":279.31,"temp_max":279.31,"pressure":989,"sea_level":989,"grnd_level":982,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":100},"wind":{"speed":7.79,"deg":219},"rain":{"3h":2.06},"sys":{"pod":"n"},"dt_txt":"2020-02-14 18:00:00"},{"dt":1581714000,"main":{"temp":278.28,"feels_like":269.82,"temp_min":278.28,"temp_max":278.28,"pressure":990,"sea_level":990,"grnd_level":984,"humidity":78,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":71},"wind":{"speed":9.6,"deg":227},"sys":{"pod":"n"},"dt_txt":"2020-02-14 21:00:00"},{"dt":1581724800,"main":{"temp":277.84,"feels_like":268.33,"temp_min":277.84,"temp_max":277.84,"pressure":993,"sea_level":993,"grnd_level":986,"humidity":72,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":71},"wind":{"speed":10.77,"deg":234},"sys":{"pod":"n"},"dt_txt":"2020-02-15 00:00:00"},{"dt":1581735600,"main":{"temp":276.91,"feels_like":267.54,"temp_min":276.91,"temp_max":276.91,"pressure":994,"sea_level":994,"grnd_level":987,"humidity":69,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":0},"wind":{"speed":10.27,"deg":224},"sys":{"pod":"n"},"dt_txt":"2020-02-15 03:00:00"},{"dt":1581746400,"main":{"temp":277.28,"feels_like":270.63,"temp_min":277.28,"temp_max":277.28,"pressure":992,"sea_level":992,"grnd_level":985,"humidity":83,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":34},"wind":{"speed":7,"deg":202},"sys":{"pod":"n"},"dt_txt":"2020-02-15 06:00:00"},{"dt":1581757200,"main":{"temp":278.24,"feels_like":270.37,"temp_min":278.24,"temp_max":278.24,"pressure":983,"sea_level":983,"grnd_level":978,"humidity":83,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":8.96,"deg":158},"rain":{"3h":0.44},"sys":{"pod":"d"},"dt_txt":"2020-02-15 09:00:00"},{"dt":1581768000,"main":{"temp":280.4,"feels_like":268.97,"temp_min":280.4,"temp_max":280.4,"pressure":972,"sea_level":972,"grnd_level":965,"humidity":81,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":14.5,"deg":177},"rain":{"3h":2.56},"sys":{"pod":"d"},"dt_txt":"2020-02-15 12:00:00"},{"dt":1581778800,"main":{"temp":281.06,"feels_like":270.04,"temp_min":281.06,"temp_max":281.06,"pressure":968,"sea_level":968,"grnd_level":962,"humidity":66,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":76},"wind":{"speed":13.34,"deg":211},"rain":{"3h":2.69},"sys":{"pod":"d"},"dt_txt":"2020-02-15 15:00:00"},{"dt":1581789600,"main":{"temp":279.52,"feels_like":266.62,"temp_min":279.52,"temp_max":279.52,"pressure":967,"sea_level":967,"grnd_level":961,"humidity":72,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":81},"wind":{"speed":15.96,"deg":225},"rain":{"3h":0.12},"sys":{"pod":"n"},"dt_txt":"2020-02-15 18:00:00"}],"city":{"id":2650225,"name":"Edinburgh","coord":{"lat":55.9521,"lon":-3.1965},"country":"GB","timezone":0,"sunrise":1581321037,"sunset":1581354211}}'

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
  return forecastList.filter(f => {
    return epochSeconds <= f.dt
  }).slice(-1)[0];
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
    console.log('hs')
    weatherResponse = await nDayForecast(cityId, Math.ceil (delta / MS_IN_DAY))
  }
  if (!weatherResponse) {
    error();
  }
  return processWeather(extractWeatherForDateTime(weatherResponse, dateTime));
}

function formatWeatherString(weather) {
  return `Forecast is for: "${weather.description}"
Wind: ${weather.wind} km/h
Temp: ${weather.temp} °C`
}

// (async function() {
//   console.log(formatWeatherString(await weatherForDate(new Date('2020-02-11T10:00:00Z'))));
// })()


module.exports = {
  weatherForDate,
  formatWeatherString,
}