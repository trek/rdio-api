  var OAuth = require('oauth').OAuth;

/*
  Rdio constructor. Options are
    key: your rdio API key
    sharedSecret: your rdio shared secret
    accessToken: an oauth access token obtained for a user
    accessTokenSecret: an oauth access toke secret obtained for a user
*/
var Rdio = function(options){
  this.key = options.key;
  this.sharedSecret = options.sharedSecret;

  this.accessToken = options.accessToken;
  this.accessTokenSecret = options.accessTokenSecret;

  this.connection = new OAuth(
    'http://api.rdio.com/oauth/request_token',
    'http://api.rdio.com/oauth/access_token',
    this.key,
    this.sharedSecret,
    "1.0",
    // we don't need a callback url, we've already obtain key and sharedSecret
    undefined,
    "HMAC-SHA1"
  );
};

Rdio.prototype = {
  apiUrl: 'http://api.rdio.com/1/',
  oauthRequestUrl: 'http://api.rdio.com/oauth/request_token',
  oauthAccessUrl: 'http://api.rdio.com/oauth/access_token',
  oauthAuthorizeUrl: 'https://www.rdio.com/oauth/authorize?oauth_token='
}

/*
  Adds rdio api methods to the Rdio.prototype object. These take the form of:

  rdioObject.aMethodName(options, cback){},

  e.g.
  var rdio = new Rdio({ ... });
  rdio.search({ query: 'John Mayer' }, function(jsonString){ console.log(jsonString)} );

  These are use primarly in the rdio api proxying route in the express application,
  where the callback is an anonymous function where the original request/responses are
  inside the scope and used to directly send the response from rdio to
  the Ember application that initially requested it.
*/
var apiMethodsDescription = require('dsl');
Object.keys(apiMethodsDescription).forEach(function(methodName){
  var methodOptions = apiMethodsDescription[methodName],
      authenticationRequired = methodOptions[0],
      requieredParameters = methodOptions[1],
      extraParameters = methodOptions[2];

  Rdio.prototype[methodName] = function(options, cback){

    // rdio wants arrays as a comma separated list
    Object.keys(options || {}).forEach(function(key){
      if(Array.isArray(options[key])){
        options[key] = options[key].join(',')
      }
    });
    options.method = methodName;

    this.connection.post(
      this.apiUrl,
      this.accessToken,
      this.accessTokenSecret,
      // the post body, which are the options with the methodName added to them
      options,
      // post content-type, doesn't matter here.
      null,
      // on response, just call the provided callback. data is a JSON-format string
      function(error, data){ cback(data);}
    )
  }
});

exports.Rdio = Rdio;