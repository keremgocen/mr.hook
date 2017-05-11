/* eslint-disable no-console */
const qs = require('querystring')
const fetch = require('node-fetch')

const getCode = (event) => {
  var code = null
  if (event.queryStringParameters && event.queryStringParameters.code) {
    code = event.queryStringParameters.code
  }
  return code
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
        // TODO save token 
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
    .then(() => successResponse(callback))
    .catch(error => errorResponse(error, callback))
