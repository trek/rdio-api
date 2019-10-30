# Rdio API library

A library for interacting with the Rdio Public API.

Since Rdio's untimely demise in 2015, this is here mostly for refernece and this repo has been achived.

```javascript
  var connection = new Rdio({
    key: 'your-api-key',
    sharedSecret: 'your-shared-secret',
    accessToken: 'an access token obtain from oauth against Rdio',
    accessTokenSecret: 'an secret token obtain from oauth against Rdio'
  });

  // now you have access to all the methods described here
  // http://www.rdio.com/developers/docs/web-service/methods/

  connection.getHeavyRotation({}, function(response){
    // response comes directly from Rdio.
    response.status; // 'ok'
    response.result; // [{...}, {...}]
  });
```

## Obtaining an OAuth Access Token
To use the Rdio object you'll need to obtain an OAuth token from Rdio.
Check `example/server.js` for a sample flow of how this might work in
your own application.