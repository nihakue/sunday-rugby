const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN;
const Twilio = require("twilio");
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
  return await client.messages.create({
    from: "whatsapp:+14155238886",
    body,
    to
  });
}

function parsePayload(event) {
  const { body, isBase64Encoded } = event;
  const payload = isBase64Encoded
    ? Buffer.from(body, "base64").toString()
    : body;
  const parsedPayload = new URLSearchParams(payload);
  return parsedPayload;
}

module.exports = {
  parsePayload,
  getTwilioClient,
  getWhatsAppParticipants,
  sendWhatsapp,
};
