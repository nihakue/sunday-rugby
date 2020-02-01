const { sendWhatsapp } = require('./twilioUtils');
const { isTestRun } = require('./util');


function getPlayers() {
  return isTestRun() ? ["whatsapp:+447719247449"] : 
  [
    "whatsapp:+447716786126",
    "whatsapp:+447593272165",
    "whatsapp:+447784462184",
    "whatsapp:+447858957440",
    "whatsapp:+17789886620",
    "whatsapp:+447719247449",
    "whatsapp:+447752809677]",
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
    console.log(message);
  }
}

async function askIfPlaying(player) {
  const message = await sendWhatsapp({
    body: `Your Rugby appointment is coming up on Sunday@11, how many people do you have?`,
    to: player
  });
  console.log(message);
}

async function askAll() {
  for (const player of getPlayers()) {
    await askIfPlaying(player);
  }
}

module.exports = {
  notifyGameOn,
  askAll
};
