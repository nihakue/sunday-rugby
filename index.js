const { reply } = require('./reply');
const { status } = require('./status');
const { poll } = require('./poll');
const { setIsTestRun } = require('./util');

if (process.env.NODE_ENV.toLowerCase() !== 'production') {
  require('dotenv').config();
}

function unknown() {
  return {
      statusCode: 404,
  };
}

function ok(body="") {
  return {
    statusCode: 200,
    headers: {
      'Content-Type':'text/xml'
    },
    body,
  }
}

exports.handler = async (event) => {
    const { path, httpMethod } = event;
    console.log('processing event: ', event);
    
    if (event.source === 'aws.events') {
      setIsTestRun(event["detail-type"].toLowerCase() === 'test');
      return await poll();
    }
    
    if (httpMethod !== 'POST') {
        return unknown();
    }
    
    try {
      switch (path) {
        case '/reply':
          const replyText = await reply(event);
          console.log('responding to reply with: ', replyText);
          return ok(replyText);
        case '/status':
          const statusText = await status(event);
          console.log('responding to status with: ', statusText);
          return ok(statusText);
        default:
          return unknown();
      }
    } catch (e) {
      console.error('something bad happened! ', e);
      throw e;
    }
};