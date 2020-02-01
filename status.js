const { parsePayload } = require('./twilioUtils');

exports.status = async (event) => {
    const parsedPayload = parsePayload(event)
    console.log('status: ', parsedPayload.get('Body'));
}