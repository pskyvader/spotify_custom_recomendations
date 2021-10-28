import { useLocation } from "react-router-dom";
import { useEffect,useRef } from "react";
import {
  stateKey
} from "./Credentials";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().hash);
  const access_token = location.get("access_token");
  const state = location.get("state");
  const storedState = localStorage.getItem(stateKey);
  let user_data=useRef(null);

  useEffect(() => {
    if (state === null || state !== storedState) {
      window.location = "/#error=state_mismatch";
      return null;
    }

    localStorage.removeItem(stateKey);
    // POST request using fetch inside useEffect React hook
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + access_token,
      },
    };

    fetch("https://api.spotify.com/v1/me", requestOptions).then((response) => {
      console.log(response);
      user_data.current.text =response;
    });
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  }, [access_token, state, storedState]);

  return (
    <div>
      <p ref={user_data}>Logged in: </p>
      callback:
      <p>access_token: {access_token}</p>
      <p>state: {state}</p>
    </div>
  );
}
