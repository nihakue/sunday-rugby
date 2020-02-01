const { notifyGameOn, askAll } = require('./notifications');
const { getNumbers } = require('./db2');
const { nextGameDay } = require('./util');
const { REQUIRED_NUM_PLAYERS } = require('./constants');

async function poll(isTest=false) {
  if ((new Date()).getDay() === 7) {
    const numPlayers = await getNumbers(nextGameDay());
    if (numPlayers < REQUIRED_NUM_PLAYERS) {
      await notifyGameOn(false, numPlayers);
    }
  } else {
    await askAll();
  }
}

module.exports = {
  poll,
}