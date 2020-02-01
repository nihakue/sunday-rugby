require('dotenv').config();

const { handler } = require('./index');
const { twilioWebhook } = require('./fixtures');
const { parsePayload } = require('./twilioUtils');
const { setIsTestRun } = require('./util');

setIsTestRun(true);

function buildReplyEvent({from, body}) {
  const payload = parsePayload(twilioWebhook);
  payload.set('From', from);
  payload.set('Body', body);
  return {...twilioWebhook, body: Buffer.from(payload.toString()).toString('base64')};
}

async function test(message) {
  const event = buildReplyEvent({from: 'whatsapp:+447719257449', body: message});
  await handler(event);
}

(async () => {
  await test(process.argv[2]);
})();