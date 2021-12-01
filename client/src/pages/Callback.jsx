import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import GetRequest from "../API/Request";
import { Redirect } from "react-router";

export default function Callback(props) {
	const url = "/authorize" + useLocation().search;
	useEffect(() => {
		GetRequest(url).then((data) => {
			if (data.error) {
				<Redirect to={"/#error=" + data.message} />;
				return;
			}
			GetRequest(
				"https://accounts.spotify.com/api/token",
				"POST",
				null,
				data
			).then((response) => {
				if (!response.error) {
					GetRequest(
						"/pushtoken",
						"POST",
						JSON.stringify(response)
					).then((tokenresponse) => {
						if (!tokenresponse.error) {
							<Redirect to="/#error=push_token_error" />;
							return;
						}
						<Redirect to="/#loggedin=true" />;
					});
					return;
				}
				<Redirect to="/#error=login_error" />;
			});
		});
	}, [url]);

	return "uwu";
}
