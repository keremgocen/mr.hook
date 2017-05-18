// const request = require('request');
const qs = require('querystring')
const fetch = require('node-fetch')
const h = require('lib/heroizer')
const aws = require('aws-sdk'); // eslint-disable-line

const dynamodb = new aws.DynamoDB.DocumentClient()

// Get card name in received Trello event
const getTrelloCardName = event => ({ slack: JSON.parse(event.body) })

// Reply Trello with 200 OK and extract card information
const respond = callback => (event) => {
  const response = { statusCode: 200 }
  callback(null, response)


  console.log('received event:', event.slack)
  // TODO handle 'createCard' type events

  // TODO handle case with 'listAfter' is not present => use 'list'
  // known bug; if a card is moved in between other cards instead of the
  // beginning or tail of the list, 'listAfter' parameter is not provided in
  // trello webhook request, instead there is a 'list' parameter

  if (event.slack.action === null ||
      event.slack.action.data.listAfter === null ||
      event.slack.action.type !== process.env.TRELLO_EVENT_TYPE) {
    return console.error('error parsing:', event.slack)
  }

  try {
    var cardName = event.slack.action.data.card.name
    var userName = event.slack.action.memberCreator.username
    var listId = event.slack.action.data.listAfter.id
    var listName = event.slack.action.data.listAfter.name
    var shortLink = event.slack.action.data.card.shortLink
  } catch (e) {
    return console.error('error parsing:', event.slack, e)
  }

  // verify list id, we want to only track a specific list
  if (listId === process.env.TRELLO_LIST_ID) {
    return {
      body: {
        card_name: cardName,
        short_link: process.env.TRELLO_CARD_URL_PREFIX + shortLink,
        user_name: userName,
        list_name: listName
      }
    }
  } else {
    console.log(cardName, 'moved to', listName, 'by', userName)
  }

  return null
}

const heroize = (message) => {
  if (message === null) return null
  message.body.card_name = h.heroize()
  return message
}

// Get the team details form DDB.
const getToken = (message) => {
  if (message === null) return null
  const params = {
    TableName: process.env.TEAMS_TABLE,
    Key: {
      list_id: process.env.TRELLO_LIST_ID
    }
  }
  return dynamodb.get(params).promise()
    .then(data => {
      return Object.assign(message, { token: data.Item.access_token })
    })
}

// TODO Verify the token matches ours, via request header
// const verifyToken = (event) => {
//   if (event.slack.token !== process.env.SLACK_VERIFICATION_TOKEN) {
//     throw new Error('InvalidToken');
//   }
//   return event;
// };

// Send a formatted message on Slack.
const postSlackMessage = (message) => {
  if (message === null) return null
  const params = {
    token: message.token,
    channel: process.env.SLACK_CHANNEL_ID,
    attachments: formatMessage(message.body) // (JSON.stringify(message.body))
  }
  const url = `https://slack.com/api/chat.postMessage?${qs.stringify(params)}`
  console.log('requesting', url)
  return fetch(url)
    .then(response => response.json()) // Convert response to JSON
    .then((json) => {
      if (json.ok) return json // Verify is valid JSON
      throw new Error('SlackAPIError')
    })
}

const formatMessage = (m) => {
  const arr = []
  const content = {
    pretext: `${m.user_name} moved card to '${m.list_name}'`,
    color: '#36a64f',
    title: m.card_name,
    title_link: `${m.short_link.trim()}`
  }

  arr.push(content)

  return JSON.stringify(arr)
}

// Entry point for the AWS Lambda hook function
module.exports.handler = (event, context, callback) =>
  Promise.resolve(event) // Start the promise chain
      // .then(verifyToken) // TODO Verify the Trello token
    .then(getTrelloCardName) // Get card name in received Trello event
    .then(respond(callback)) // Respond OK to Slack
    .then(heroize) // heroize the card name with a random one
    .then(getToken) // Get the team data from DDB
    .then(postSlackMessage) // Post a custom message on Slack
    .catch(callback)
