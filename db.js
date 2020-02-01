const AWS = require('aws-sdk');
const BUCKET = 'sunday-rugby-private';
const DAYS_PATH = 'days';
AWS.config.update({region: 'eu-west-1'});
const s3 = new AWS.S3();

function dayPath(day) {
  return `${DAYS_PATH}/${day}`;
}

function numbersPath(day, id, numPlayers) {
  return `${dayPath(day)}/${id}/${numPlayers}`;
}

async function getNumbers(day) {
  const players = await getPlayers(day);
  return Object.values(players).reduce((prev, curr) => prev + curr, 0);
}

async function setNumPlayers(day, id, numPlayers) {
  const response = await s3.putObject({
    Body: JSON.stringify(''), 
    Bucket: BUCKET,
    Key: numbersPath(day, id, numPlayers),
  }).promise();
}

async function getPlayers(day) {
  console.log('getPlayers ', day);
  const response = await s3
  .listObjectsV2({
    Bucket: BUCKET,
    Prefix: `${dayPath(day)}/`
  })
  .promise();
  const { IsTruncated, Contents } = response;
  if (IsTruncated) {
    throw Error('too many responses');
  }
  const sorted = Contents.sort((b, a) => a.LastModified.getTime() - b.LastModified.getTime());
  const players = sorted.reduce((prev, curr) => {
    const [player, count] = curr.Key.split('/').slice(-2);
    if (player in prev) {
      return prev;
    }
    return {...prev, [player]: parseInt(count, 10)};
  }, {});
  return players;
}

module.exports = {
    getNumbers,
    setNumPlayers,
    getPlayers,
}