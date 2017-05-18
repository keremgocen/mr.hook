# mr.hook
A bot for hooking up Trello lists with a Slack channel

TODO instructions for setup
## dependencies

- serverless framework (https://serverless.com/)
- aws account

## config instructions

- use `serverless.temp.yml` file for local setup, more info [here](https://serverless.com/framework/docs/providers/aws/guide/quick-start/)
- you need to setup a webhook from trello via it's [API](https://developers.trello.com/apis/webhooks)

A simple POST to Trello web API using your token and the idModel for the list you'd like Mr. Hook to track should be sufficient to set things up;

```
$.post("https://api.trello.com/1/tokens/[USER_TOKEN]/webhooks/?key=[APPLICATION_KEY]", {
  description: "My first webhook",
  callbackURL: "http://www.mywebsite.com/trelloCallback",
  idModel: "4d5ea62fd76aa1136000000c",
});
```

- provide 4 more parameters required for Slack setup in your `serverless.yml` file
    - SLACK_CLIENT_ID
    - SLACK_CLIENT_SECRET
    - SLACK_CHANNEL_ID (channel id or name you want Mr. Hook to post)
    - TRELLO_LIST_ID (idModel of the list you'd like to track)


