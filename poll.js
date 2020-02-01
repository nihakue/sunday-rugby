const { notifyGameOn, askAll } = require('./notifications');
const { getNumbers } = require('./db');
const { nextGameDay } = require('./util');
const { REQUIRED_NUM_PLAYERS } = require('./constants');

async function poll() {
  if ((new Date()).getDay() === 6) {
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