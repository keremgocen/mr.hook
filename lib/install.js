/* eslint-disable no-console */
const qs = require('querystring')
const fetch = require('node-fetch')
const aws = require('aws-sdk')

const dynamodb = new aws.DynamoDB.DocumentClient()

const getCode = (event) => {
  var code = null
  if (event.queryStringParameters && event.queryStringParameters.code) {
    code = event.queryStringParameters.code
  }
  return code
}

const saveResponse = (response) => {
  response.list_id = process.env.TRELLO_LIST_ID
  const params = {
    TableName: process.env.TEAMS_TABLE,
    Item: response
  }
  console.log('Put', params)
  return dynamodb.put(params).promise()
}

const requestToken = (code) => {
  console.log(`Requesting token with ${code}`)
  if (code === null) { return null } // Skip if triggered without code
  const params = {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code
  }
  const url = `https://slack.com/api/oauth.access?${qs.stringify(params)}`
  console.log(`Fetching ${url}`)
  return fetch(url)
    .then(response => {
      return response.json()
    })
    .then((json) => {
      if (json.ok) {
        console.log('response', json)
        return json // Verify is valid JSON
      }
      throw new Error('SlackAPIError')
    })
}

// placeholder for a success page
const successResponse = callback => callback(null, {
  statusCode: 302,
  headers: { Location: process.env.INSTALL_SUCCESS_URL }
})

// placeholder for an error page
const errorResponse = (error, callback) => {
  console.error(error)
  return callback(null, {
    statusCode: 302,
    headers: { Location: process.env.INSTALL_ERROR_URL }
  })
}

// Entry point for the AWS Lambda install function
module.exports.handler = (event, context, callback) =>
  Promise.resolve(event)
    .then(getCode) // Get code from event
    .then(requestToken) // Exchange code for token
    .then(saveResponse) // Save token to DDB
    .then(() => successResponse(callback))
    .catch(error => errorResponse(error, callback))
