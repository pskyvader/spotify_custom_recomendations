import { useLocation } from "react-router-dom";
import { Redirect } from "react-router";


import { stateKey } from "../../API/Credentials";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().hash.replace("#","?"));
  const access_token = location.get("access_token");
  const state = location.get("state");
  const expires_in = location.get("expires_in");
  localStorage.setItem('expiration',Date.now()+(expires_in*1000));
  const storedState = localStorage.getItem(stateKey);

  if (state === null || state !== storedState || access_token===null) {
    return <Redirect to="/#error=state_mismatch"/>
  }else{
    localStorage.removeItem(storedState);
    localStorage.setItem('access_token',access_token);
    return <Redirect to="/"/>
  }
}
