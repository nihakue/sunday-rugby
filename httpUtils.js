const https = require('https');

async function get(url) {
  let response = '';

  return new Promise((resolve, reject) => {
    https.get(url, (resp) => {
      resp.on('data', (chunk) => {
        response += chunk;
      });

      resp.on('end', () => {
        resolve(response);
      });

    }).on('error', reject)
  })
}

module.exports = {
  get,
}