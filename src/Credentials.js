var request = require('request'); // "Request" library


var client_id = '6e8b594462ac469c95cf1f137ae901a7'; // Your client id
var client_secret = 'd91be2fbd4d64d8f846b30dccf1abd12'; // Your secret

// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (Buffer.from((client_id + ':' + client_secret), "base64"))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};





request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
  
      // use the access token to access the Spotify Web API
      var token = body.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        console.log(body);
      });
    }
  });