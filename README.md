# Sunday Rugby

This is a little Twilio chatbot I hacked together to help organize a weekly Rugby game. I noticed that even though we had a set time each week we played, every week we had to figure out if there were enough numbers to play. This bot asks each member of the group a couple of days before gameday if they can make it (along with the weather forecast and current confirmed numbers).

## What does it look like?

On the Thursday before a game:

> Your appointment is coming up on RugbySunday at 11:00 and 3 players have already confirmed.
How many players are you bringing (including yourself)?
Forecast is for: broken clouds
Wind: 8.12 km/h
Temp: 4.15 °C

With confirmed players:

> Your appointment is coming up on Sunday at 11:00 and 3 players have already confirmed.
How many players are you bringing (including yourself)?
Forecast is for: broken clouds
Wind: 8.12 km/h
Temp: 4.15 °C

On the morning of gameday:

> Your Rugby code is "No game this week". 3 players confirmed so far.

Or if there are enough players:

> Your Rugby code is "GAME ON!". 3 players confirmed so far."

## How does it work?

The chatbot itself is just a Lambda + API Gateway HTTP API exposing a /reply webhook. This webhook is invoked by Twilio when a player sends a message to my Twilio number. Twilio handles all the complexity of interacting with WhatsApp. Player numbers are stored in a DynamoDB table, and the function is manually invoked on a schedule by Cloudwatch events. I am using https://openweathermap.org/api to get the weather forecast and dotenv to load credentials/api keys.

## Can I use this?

If you can be bothered to set up the infrastructure, you're more than welcome to. Here are all the env variables you need to set in your .env file for local development, as well as in your Lambda function:

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
AWS_REGION=
AWS_PROFILE=
NODE_ENV=
WEATHER_API_KEY=
```

At some point if this proves useful I will put all the infra into cloudformation/CDK, but for now you will need:

1. API Gateway HTTP API
2. Node 12 Lambda function
3. DynamoDB table called 'sunday-rugby'
4. Cloudwatch Events to invoke on a schedule
5. All associated IAM roles etc.