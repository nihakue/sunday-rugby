const { getNumbers } = require('./db');

(async (day='2019-01-01') => {
  console.log(' numbers: ', await getNumbers(day));
})();
