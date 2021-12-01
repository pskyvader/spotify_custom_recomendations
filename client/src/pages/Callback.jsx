import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GetRequest from "../API/Request";
// import { Redirect } from "react-router";

// import { Credentials } from "../API";

export default function Callback(props) {
	const url = "/callback" + useLocation().search + "&return=true";
	useEffect(() => {
		fetch(url)
			.then((res) => res.json())
			.then((data) => {
				const form=new URLSearchParams(data.form);
				const requestOptions = {
					method: "POST",
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: data.headers.Authorization,
					},
					body: form,
				};
				GetRequest(data.url, "POST", null, requestOptions).then(
					(response) => {
						console.log(response);
					}
				);
			});
	}, [url]);

	return "uwu";
	// let location = new URLSearchParams(useLocation().hash.replace("#", "?"));
	// const access_token = location.get("access_token");
	// const state = location.get("state");
	// const expires_in = location.get("expires_in");
	// localStorage.setItem("expiration", Date.now() + expires_in * 1000);
	// const storedState = localStorage.getItem(Credentials.stateKey);

	// if (state === null || state !== storedState || access_token === null) {
	// 	return <Redirect to="/#error=state_mismatch" />;
	// } else {
	// 	localStorage.removeItem(storedState);
	// 	localStorage.setItem("access_token", access_token);
	// 	return <Redirect to="/" />;
	// }
}
