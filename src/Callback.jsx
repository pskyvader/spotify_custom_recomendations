import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { stateKey } from "./Credentials";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().hash.replace("#","?"));
  const access_token = location.get("access_token");
  const state = location.get("state");
  const token_type = location.get("token_type");
  const expires_in = location.get("expires_in");
  const storedState = localStorage.getItem(stateKey);
  const [response, setResponse] = useState(null);
//   console.log(access_token,state,token_type,expires_in);

  if (state === null || state !== storedState) {
    window.location = "/#error=state_mismatch";
    // return null;
  }

  useEffect(() => {
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    };

    fetch("https://api.spotify.com/v1/me", requestOptions).then(response => response.json()).then((response) => {
        const final=<div>
        {
          Object.keys(response).map((key, i) => {
              console.log(response[key])
            return  <p key={i}>
              <span>Key Name: {key}</span>
              <span>Value: {response[key]}</span>
            </p>
          })
        }
      </div>;
      console.log(final)
        setResponse(final);
    });
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [access_token, state, storedState]);
  
  console.log(response)

  return (
    <div>
      <div>Logged in: {response} </div>
      callback:
      <p>access_token: {access_token}</p>
      <p>state: {state}</p>
    </div>
  );
}
