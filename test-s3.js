const { getNumbers } = require('./db2');

(async (day='2019-01-01') => {
  console.log(' numbers: ', await getNumbers(day));
})();
