const { parsePayload } = require('./twilioUtils');
const { setNumPlayers, getNumbers } = require('./db');
const { nextGameDay } = require('./util');
const { notifyGameOn } = require('./notifications');
const { REQUIRED_NUM_PLAYERS } = require('./constants');

exports.reply = async (event) => {
    const parsedPayload = parsePayload(event)
    const id = parsedPayload.get('From');
    const message = parsedPayload.get('Body');
    const day = nextGameDay();
    if (!/^\d+$/.test(message)) {
        return;
    }
    const oldNumPlayers = await getNumbers(day);
    const newPlayers = parseInt(message, 10);
    console.log(`Setting ${id}'s number of players for ${day} to ${newPlayers}`);
    await setNumPlayers(day, id, newPlayers);
    const newNumPlayers = await getNumbers(day);
    console.log(`old: ${oldNumPlayers} new: ${newNumPlayers}, add: ${newPlayers}`);
    if (newNumPlayers >= REQUIRED_NUM_PLAYERS) {
        await notifyGameOn(true, newNumPlayers);
        return;
    }
    if (oldNumPlayers >= REQUIRED_NUM_PLAYERS && newNumPlayers < REQUIRED_NUM_PLAYERS) {
      await notifyGameOn(false, newNumPlayers)
    }
    console.log('reply: ', parsedPayload.get('Body'));
}