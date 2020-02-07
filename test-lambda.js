require('dotenv').config();

const { handler } = require('./index');
const { twilioWebhook, cloudwatchTestEvent, cloudwatchProdEvent } = require('./fixtures');
const { parsePayload, sendWhatsapp } = require('./twilioUtils');
const { setIsTestRun } = require('./util');

setIsTestRun(true);

function buildReplyEvent({from, body}) {
  const payload = parsePayload(twilioWebhook);
  payload.set('From', from);
  payload.set('Body', body);
  return {...twilioWebhook, body: Buffer.from(payload.toString()).toString('base64')};
}

async function testReply(message) {
  const event = buildReplyEvent({from: 'whatsapp:+447719247449', body: message});
  await handler(event);
}

async function testTwilio(command) {
  return await sendWhatsapp({to: command[0], body: command[1]});
}

(async () => {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  if (!command) {
    return;
  }

  switch (command) {
    case 'notify:test':
      return await handler(cloudwatchTestEvent);
    case 'notify:prod':
      return await handler(cloudwatchProdEvent);
    case 'twilio':
      return await testTwilio(args);
    default:
      return await testReply(command);
  }

})();