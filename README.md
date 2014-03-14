# Rdio API library

A library for interacting with the Rdio Public API

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