import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { stateKey } from "./Credentials";
import { objectToList } from "./Utils";

import { Redirect } from "react-router";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().hash.replace("#","?"));
  const access_token = location.get("access_token");
  const state = location.get("state");
  const expires_in = location.get("expires_in");
  localStorage.setItem('expiration',Date.now()+(expires_in*1000));
  const storedState = localStorage.getItem(stateKey);
  const [response, setResponse] = useState(null);

  if (state === null || state !== storedState || access_token===null) {
    // window.location = "/#error=state_mismatch";
    return <Redirect to="/#error=state_mismatch"/>
    // return null;
  }else{
    localStorage.setItem('access_token',access_token);
    // window.location = "/";
    return <Redirect to="/"/>
  }

  // useEffect(() => {
  //   // POST request using fetch inside useEffect React hook
  //   const requestOptions = {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + access_token,
  //     },
  //   };

  //   fetch("https://api.spotify.com/v1/me", requestOptions).then(response => response.json()).then((response) => {
  //       setResponse(objectToList(response));
  //   });
  //   // empty dependency array means this effect will only run once (like componentDidMount in classes)
  // }, [access_token]);
  

  // return (
  //   <div>
  //     <div>Logged in: {response} </div>
  //     callback:
  //     <p>access_token: {access_token}</p>
  //     <p>state: {state}</p>
  //   </div>
  // );
}
