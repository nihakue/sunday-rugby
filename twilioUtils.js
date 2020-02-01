const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const Twilio = require("twilio");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
let client;

function getTwilioClient() {
  if (typeof client !== "undefined") {
    return client;
  }

  return (client = Twilio(accountSid, authToken));
}

async function getWhatsAppParticipants() {
  const client = getTwilioClient();
  client;
}

async function sendWhatsapp({ to, body }) {
  const client = getTwilioClient();
  const test = isTestRun();
  return await client.messages.create({
    from: "whatsapp:+14155238886",
    body: test ? `To: ${to}\nBody: ${body}` : body,
    to: test ? "whatsapp:+447719247449" : to
  });
}

function buildWhatsappReply(response=baseResponse(), {body}) {
  const message = response.message();
  message.body(body);
  return response;
}

function baseResponse() {
  return new MessagingResponse();
}

function parsePayload(event) {
  const { body, isBase64Encoded } = event;
  const payload = isBase64Encoded
    ? Buffer.from(body, "base64").toString()
    : body;
  console.log(payload);
  const parsedPayload = new URLSearchParams(payload);
  return parsedPayload;
}

module.exports = {
  parsePayload,
  getTwilioClient,
  getWhatsAppParticipants,
  sendWhatsapp,
  buildWhatsappReply,
  baseResponse
};
