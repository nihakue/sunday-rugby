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

let _isTestRun = false;
function setIsTestRun(isTestRun=false) {
  console.log('istest', isTestRun);
  return _isTestRun = Boolean(isTestRun);
}

function isTestRun() {
  return _isTestRun;
}

module.exports = {
  nextGameDay,
  setIsTestRun,
  isTestRun,
  isGameTime
}