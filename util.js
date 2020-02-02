function addDays(date, days) {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function isGameTime() {
  return getDateString(nextGameDate()) === getDateString(new Date());
}

function nextGameDate() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0 && today.getUTCHours() < 12) {
    return today;
  }
  return addDays(today, 7 - today.getDay());
}

function nextGameDay() {
  return getDateString(nextGameDate());
}

function getDateString(date) {
  return date.toISOString().split('T')[0];
}

function setIsTestRun(isTestRun=false) {
  process.env['RUGBY_TEST_RUN'] = isTestRun;
}

function isTestRun() {
  const testRunString = process.env['RUGBY_TEST_RUN'];
  if (testRunString === 'undefined') {
    return false;
  }
  return Boolean(testRunString);
}

module.exports = {
  nextGameDay,
  setIsTestRun,
  isTestRun,
  isGameTime
}