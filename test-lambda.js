require('dotenv').config();

const { handler } = require('./index');
const { twilioWebhook, cloudwatchTestEvent } = require('./fixtures');
const { parsePayload } = require('./twilioUtils');
const { setIsTestRun } = require('./util');

setIsTestRun(true);

function buildReplyEvent({from, body}) {
  const payload = parsePayload(twilioWebhook);
  payload.set('From', from);
  payload.set('Body', body);
  return {...twilioWebhook, body: Buffer.from(payload.toString()).toString('base64')};
}

async function testReply(message) {
  const event = buildReplyEvent({from: 'whatsapp:+447719257449', body: message});
  await handler(event);
}

async function testNotify() {
  await handler(cloudwatchTestEvent);
}

(async () => {
  const command = process.argv[2];

  if (!command) {
    return;
  }

  if (command === 'notify') {
    await testNotify();
  }

  await testReply(process.argv[2]);
})();