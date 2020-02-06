if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const AWS = require('aws-sdk');
const TABLE_NAME = 'sunday-rugby';
// TODO: Make this dynamic based on something...?
const team = 'lions';
const ddb = new AWS.DynamoDB.DocumentClient()


async function getNumbers(day) {
  const players = await getPlayers(day);
  return Object.values(players).reduce((prev, curr) => prev + curr, 0);
}

async function getPlayerNumbers(day) {
  const players = await getPlayers(day);
  const total = Object.values(players).reduce((prev, curr) => prev + curr, 0);
  return {total, players};
}

async function initializePlayers(day) {
  try {
    await ddb.update({
      TableName: TABLE_NAME,
      Key: { 
        team,
        day
      },
      UpdateExpression: "set #p = :empty",
      ConditionExpression: "attribute_not_exists(players)",
      ExpressionAttributeNames: {
        "#p": "players"
      },
      ExpressionAttributeValues: {
        ":empty": {}
      }
    }).promise();
  } catch (e) {
    if (e.code !== "ConditionalCheckFailedException") {
      throw e;
    }
  }
}

async function setNumPlayers(day, id, numPlayers) {
  await initializePlayers(day);
  await ddb.update({
    TableName: TABLE_NAME,
    Key: { 
      team,
      day
    },
    UpdateExpression: "set #p.#id = :n",
    ExpressionAttributeValues: {
      ":n": numPlayers,
    },
    ExpressionAttributeNames: {
      "#id": id,
      "#p": "players",
    }
  }).promise();
}

async function getPlayers(day) {
  const item = await ddb.get({
    TableName: TABLE_NAME,
    Key: {
      team,
      day
    }
  }).promise();
  return item.Item && item.Item.players ? item.Item.players : {};
}

module.exports = {
    getNumbers,
    setNumPlayers,
    getPlayers,
    getPlayerNumbers,
}