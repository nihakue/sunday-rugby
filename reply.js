const { parsePayload, buildWhatsappReply, baseResponse } = require('./twilioUtils');
const { setNumPlayers, getNumbers, getPlayers } = require('./db2');
const { nextGameDay } = require('./util');
const { notifyGameOn } = require('./notifications');
const { REQUIRED_NUM_PLAYERS } = require('./constants');

async function setNumPlayersReply({day, to, oldNumPlayers, message}) {
  const newPlayers = parseInt(message, 10);
  console.log(`Setting ${to}'s number of players for ${day} to ${newPlayers}`);
  await setNumPlayers(day, to, newPlayers);
  const newNumPlayers = await getNumbers(day);
  console.log(`old: ${oldNumPlayers} new: ${newNumPlayers}, add: ${newPlayers}`);
  if (newNumPlayers >= REQUIRED_NUM_PLAYERS) {
      await notifyGameOn(true, newNumPlayers);
      return;
  }
  if (oldNumPlayers >= REQUIRED_NUM_PLAYERS && newNumPlayers < REQUIRED_NUM_PLAYERS) {
    await notifyGameOn(false, newNumPlayers)
  }

  return `OK, ${newPlayers} players. Got it.`;
}

async function tellWhosPlaying({day, to, oldNumPlayers, message}) {
  console.log('tell who is playing', day, to, oldNumPlayers, message);
  const playersObj = await getPlayers(day);
  const players = Object.keys(playersObj).map(player => `${player}: bringing ${playersObj[player]}`);
  return `${oldNumPlayers} confirmed players:\n${players.join(',\n')}`;
}

exports.reply = async (event) => {
    const parsedPayload = parsePayload(event)
    const to = parsedPayload.get('From');
    const message = parsedPayload.get('Body');
    const day = nextGameDay();

    console.log('processing reply: ', message);
    const oldNumPlayers = await getNumbers(day);
    const allHandlers = [
      {
        test: /^\d+$/,
        handler: setNumPlayersReply,
      },
      {
        test: /^who/i,
        handler: tellWhosPlaying
      },
    ]

    const handlers = allHandlers.filter(handler => handler.test.test(message));
    const response = await handlers.reduce(async (reply, h) => {
      const responseText = await h.handler({to, day, oldNumPlayers, message, reply});
      return buildWhatsappReply(reply, {body: responseText});
    }, baseResponse());
    if (!response) {
      return null;
    }
    return typeof response.toString === 'function' ? response.toString() : null;
}