const accountSid = 'AC36ffb52c94b82a1c541c99bd8294c93f';
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const players = [
  '+447719247449'
]

async function notifyGameOn(gameOn=true, numPlayers) {
  for (const player of players) {
    const message = await client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: `Your Rugby code is "${gameOn ? 'GAME ON!' : 'No game this week.'} ${numPlayers} players confirmed so far."`,
         to: `whatsapp:${player}`,
       });
    console.log(message);
  }
}

async function askIfPlaying(player) {
  const message = await client.messages
      .create({
         from: 'whatsapp:+14155238886',
         body: `Your Rugby appointment is coming up on Sunday@11, how many people do you have?`,
         to: `whatsapp:${player}`,
       });
    console.log(message);
}

async function askAll() {
  for (const player of players) {
    await askIfPlaying(player);
  }
}

module.exports = {
  notifyGameOn,
  askAll,
}