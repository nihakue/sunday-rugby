const { parsePayload } = require('./twilioUtils');

exports.reply = async (event) => {
    const parsedPayload = parsePayload(event)
    console.log('status: ', parsedPayload.get('Body'));
}