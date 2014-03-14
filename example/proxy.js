/*
  This is a very simple example proxy server.
  If you visit before authentication you'll be redirected
  to an OAuth flow for authentcation.

  Before starting, set
  RDIO_API_KEY and RDIO_SHARED_SECRET as environemnt variables

  Then start with
  ```
  $ node ./proxy.js
  ```

*/
var express = require('express'),
    OAuth = require('oauth').OAuth,
    querystring = require('querystring'),
    url = require('url'),
    fs = require('fs');

var config = {
  rdioOauthRequestUrl: 'http://api.rdio.com/oauth/request_token',
  rdioOauthAccessUrl: 'http://api.rdio.com/oauth/access_token',
  rdioAuthUrl: 'https://www.rdio.com/oauth/authorize?oauth_token=',
  rdioApiKey: process.env.RDIO_API_KEY,
  rdioApiSharedSecret: process.env.RDIO_SHARED_SECRET,
  host: 'localhost',
  port: '3000'
}

// Make a new express.js app. See http://expressjs.com/ for more on express.
var app = express();
app.use(express.logger());       // writes console.log calls out to the terminal
app.use(express.bodyParser());   // turns HTTP bodies into javascript object literals
app.use(express.cookieParser()); // turns cookie data into javascript object literals

app.configure('development', function(){
  app.use( express.session( { secret: "whateverthisdoesntmatter" }));
});

// loads the index.tmpl which will request the Ember application,
// compiled app templates, other javascripts, and css.
app.get('/', function(req, res){
  if (!req.session.oauthAccessToken) {
    // if this requester is not logged in through Rdio. Start the
    // login process by sending them to /auth/rdio on this app.
    res.redirect('/auth/rdio');
  } else {
    // if this requester is logged in, send them the index.html which
    // will make requests via <script> and <link> for browser-application
    // assets
    fs.readFile(__dirname + './index.tmpl', function(err, str){
      res.type('html').send(str);
    });
  }
});

/*
  rdio API proxying. Accepts post requests to '/api/:rdioApiMethodName' on
  this server, creates a new Rdio object (see the rdio-api node module),
  and makes a request to the same rdio method name, sending the JSON-format
  string response directly to the browser, where it is parsed by jQuery and
  passed into Ember as objects.
*/
app.post('/api/:rdioApiMethodName', function(req, res){
  var rdio = new Rdio({
    key: config.rdioApiKey,
    sharedSecret: config.rdioApiSharedSecret,
    accessToken: req.session.oauthAccessToken,
    accessTokenSecret: req.session.oauthAccessTokenSecret
  });
  console.log(req.body);
  rdio[req.params.rdioApiMethodName](req.body || {}, function(rdioResponse){
    res.send(rdioResponse);
  });
});

/*
  OAuth Authentication
  The server shares a single OAuth object that handles
  obtaining tokens so we can make requests on behalf of a user.

  Unauthenticated users are sent to /auth/rdio which starts the
  process and redirects them to a page on rdio.com
  where they can agree to allow this app to interact with the API.

  After they agree, they'll be redirected back to /auth/rdio/callback
  with some data passed as a query string. This data is used to make
  another request and get a 'Request Token' for them.

  This token's value is stored in a session and the use is redirected
  back to '/' which will load the index.html and the Ember bits of the app.

*/
var oa = new OAuth(
  config.rdioOauthRequestUrl,
  config.rdioOauthAccessUrl,
  config.rdioApiKey,
  config.rdioApiSharedSecret,
  "1.0",
  "http://"+config.host+":"+config.port+"/auth/rdio/callback", "HMAC-SHA1");

/*
  URL for rdio authentcation. Users will be redirected here if they request '/'
  and haven't given persmission for us to interact with rdio for them.
*/
app.get('/auth/rdio', function(req, res){
  oa.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret){
    if (error) {
      console.log("error:", error);
    } else {
      // store the tokens in the session
      req.session.oauthToken = oauthToken;
      req.session.oauthTokenSecret = oauthTokenSecret;

      // redirect the user to authorize the token
      res.redirect(config.rdioAuthUrl+oauthToken  );
    }
  });
});

/*
  Users will be redirected here after they 'Allow' on the rdio oauth page.
  Then a access token is stored in the session for this user. We use this
  access to token to make proxying requests in the post('/api/:rdioApiMethodName')
  route matcher.
*/
app.get('/auth/rdio/callback',function(req, res){
  var parsedUrl = url.parse(req.url, true);
  oa.getOAuthAccessToken(parsedUrl.query.oauth_token, req.session.oauthTokenSecret, parsedUrl.query.oauth_verifier,
    function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      req.session.oauthAccessToken = oauthAccessToken;
      req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
      res.redirect("/");
    }
  )
});

app.listen(config.port);
console.log('Server started on port '+config.port);
