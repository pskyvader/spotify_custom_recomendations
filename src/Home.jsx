import { client_id, stateKey, redirect_uri } from "./Credentials";

import { generateRandomString } from "./Utils";

export default function Home(params) {
  return <button onClick={login}> Login </button>;
}

var login = function () {
  var state = generateRandomString(16);
  localStorage.setItem(stateKey, state);
  // your application requests authorization
  var scope = "user-read-private user-read-email";
  var uri =
    "https://accounts.spotify.com/authorize?" +
    new URLSearchParams({
      response_type: "code",
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
    });
  window.location = uri;
};
