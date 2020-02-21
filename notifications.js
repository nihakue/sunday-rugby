const { sendWhatsapp } = require('./twilioUtils');
const { getPlayerNumbers } = require('./db');
const { isTestRun, nextGameDay, nextGameDateTime } = require('./util');
const { weatherForDate, formatWeatherString } = require('./weather');

const GABRIEL = "whatsapp:+447719247449";
const ROBYN = "whatsapp:+447752809677";
function getPlayers() {
  return isTestRun() ? [GABRIEL, ROBYN] : 
  [
    GABRIEL,
    ROBYN,
  ]
}

async function notifyGameOn(gameOn, numPlayers) {
  for (const player of getPlayers()) {
    const message = await sendWhatsapp({
      to: player,
      body: `Your Rugby code is "${
        gameOn ? "GAME ON!" : "No game this week."
      }". ${numPlayers} players confirmed so far.`
    });
  }
}

async function askIfPlaying(player, numPlayers, forecast) {
  console.log(`asking if ${player} is playing`);
  const message = await sendWhatsapp({
    body: `Your appointment is coming up on RugbySunday at 11:00${numPlayers > 0 ? ` and ${numPlayers} players have already confirmed` : ''}. How many players are you bringing (including yourself)? ${forecast}`,
    to: player
  });
}

async function askAll() {
  const forecast = formatWeatherString(await weatherForDate(nextGameDateTime()));
  const {total, players: confirmed} = await getPlayerNumbers(nextGameDay())
  for (const player of getPlayers()) {
    if (!(player in confirmed) || player === GABRIEL) {
      await askIfPlaying(player, total, forecast);
    } else {
      console.log(`not asking ${player} since they've already responded`)
    }
  }
}

module.exports = {
  notifyGameOn,
  askAll
};
