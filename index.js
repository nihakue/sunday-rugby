const { reply } = require('./reply');
const { status } = require('./status');
const { poll } = require('./poll');

if (process.env.NODE_ENV.toLowerCase() !== 'production') {
  require('dotenv').config();
}

function unknown() {
  const response = {
      statusCode: 404,
  };
}

exports.handler = async (event) => {
    // TODO implement
    const { path, httpMethod } = event;
    
    if (event.source === 'aws.events') {
        return await poll();
    }
    
    if (httpMethod !== 'POST') {
        return unknown();
    }
    
    switch (path) {
        case '/reply':
            return await reply(event);
        case '/status':
            return await status(event);
        default:
            return unknown();
    }
};