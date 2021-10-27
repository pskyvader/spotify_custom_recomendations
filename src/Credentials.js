import {
    generateRandomString
} from "./Utils";

var client_id = '6e8b594462ac469c95cf1f137ae901a7'; // Your client id
// var client_secret = 'd91be2fbd4d64d8f846b30dccf1abd12'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri
var stateKey = 'spotify_auth_state';

var login = function() {
    var state = generateRandomString(16);
    localStorage.setItem(stateKey, state);
    // your application requests authorization
    var scope = 'user-read-private user-read-email';
    var uri = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    });
    window.location = uri;
}


export default login;