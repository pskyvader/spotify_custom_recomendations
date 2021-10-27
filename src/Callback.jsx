import { useLocation } from "react-router-dom";
import { stateKey } from "./Credentials";

export default function Callback(props) {
  let location = new URLSearchParams(useLocation().search);
  const code = location.get("code");
  const state = location.get("state");

  const storedState = localStorage.getItem(stateKey);

  if (state === null || state !== storedState) {
    window.location = "/#error=state_mismatch";
    return null;
  }

  return (
    <div>
      callback:
      <p>code: {code}</p>
      <p>state: {state}</p>
    </div>
  );
}
