import {useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GetRequest from "../API/Request";

export default function Callback(props) {
	const [redirect, SetRedirect] = useState(null);
	const url = "/api/authorize" + useLocation().search;
	useLayoutEffect(() => {
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
						"/api/pushtoken?" + new URLSearchParams(response)
					).then((tokenresponse) => {
						if (!tokenresponse.loggedin) {
							SetRedirect("/#error=push_token_error");
							return;
						}
						SetRedirect("/#loggedin=true");
					});
					return;
				}
				SetRedirect("/#error=login_error");
			});
		});
	}, [url]);
	if (redirect) {
		window.location = redirect;
	}

	return "uwu";
}
