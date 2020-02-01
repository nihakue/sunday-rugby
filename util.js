function addDays(date, days) {
  var newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function nextGameDate() {
  const today = new Date();
  return addDays(today, 7 - today.getDay());
}

function nextGameDay() {
  return nextGameDate().toISOString().split('T')[0];
}

module.exports = {
  nextGameDay,
}