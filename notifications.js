const { sendWhatsapp } = require('./twilioUtils');
const { getPlayerNumbers } = require('./db');
const { isTestRun, nextGameDay } = require('./util');

const GABRIEL = "whatsapp:+447719247449";
const ROBYN = "whatsapp:+447752809677";
function getPlayers() {
  return isTestRun() ? [GABRIEL, ROBYN] : 
  [
    "whatsapp:+447716786126",
    "whatsapp:+447593272165",
    "whatsapp:+447784462184",
    "whatsapp:+447858957440",
    "whatsapp:+17789886620",
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
      } ${numPlayers} players confirmed so far."`
    });
  }
}

async function askIfPlaying(player, numPlayers) {
  console.log(`asking if ${player} is playing`);
  const message = await sendWhatsapp({
    body: `Your Rugby appointment is coming up on Sunday@11${numPlayers > 0 ? ` and ${numPlayers} people have already confirmed` : ''}. How many players are you bringing (including yourself)?`,
    to: player
  });
}

async function askAll() {
  const {total, players: confirmed} = await getPlayerNumbers(nextGameDay())
  for (const player of getPlayers()) {
    if (!(player in confirmed) || player === GABRIEL) {
      await askIfPlaying(player, total);
    } else {
      console.log(`not asking ${player} since they've already responded`)
    }
  }
}

module.exports = {
  notifyGameOn,
  askAll
};
