import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GetRequest from "../API/Request";
import { Redirect } from "react-router";

export default function Callback(props) {
	const [redirect, SetRedirect] = useState(null);
	const url = "/api/authorize" + useLocation().search;
	useEffect(() => {
		GetRequest(url).then((data) => {
			if (data.error) {
				SetRedirect("/#error=" + data.message);
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
						"/api/pushtoken",
						"POST",
						JSON.stringify(response)
					).then((tokenresponse) => {
						if (!tokenresponse.error) {
							SetRedirect("/#loggedin=true");
							return;
						}
						SetRedirect("/#error=push_token_error");
					});
					return;
				}
				SetRedirect("/#error=login_error");
			});
		});
	}, [url]);

	return redirect ? <Redirect to={redirect} /> : "uwu";
}
