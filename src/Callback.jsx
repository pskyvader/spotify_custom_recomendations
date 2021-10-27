import { useLocation } from "react-router-dom";
import {
  stateKey,
  redirect_uri,
  client_id,
  client_secret,
} from "./Credentials";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().search);
  const code = location.get("code");
  const state = location.get("state");

  const storedState = localStorage.getItem(stateKey);

  if (state === null || state !== storedState) {
    window.location = "/#error=state_mismatch";
    return null;
  }

//   var authOptions = {
//     url: "https://accounts.spotify.com/api/token",
//     form: {
//       code: code,
//       redirect_uri: redirect_uri,
//       grant_type: "authorization_code",
//     },
//     headers: {
//       Authorization:
//         "Basic " + Buffer.from(client_id + ":" + client_secret, "base64"),
//     },
//     json: true,
//   };

//   console.log(authOptions);

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "Basic " + Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    body: JSON.stringify({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }),
  };


  fetch("https://accounts.spotify.com/api/token", requestOptions)
    .then(async (response) => console.log(response.json()));

  return (
    <div>
      callback:
      <p>code: {code}</p>
      <p>state: {state}</p>
    </div>
  );
}
