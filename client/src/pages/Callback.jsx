import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import GetRequest from "../API/Request";

export default function Callback(props) {
	const url = "/authorizeuser" + useLocation().search;
	useLayoutEffect(() => {
		GetRequest(url)
			.then((data) => {
				if (data.error) {
					data.finalRedirect = "/#error=" + data.message;
				}
				return data;
			})
			.then((data) => {
				if (data.finalRedirect) {
					return data;
				}
				return GetRequest(
					"https://accounts.spotify.com/api/token",
					"POST",
					null,
					data
				);
			})
			.then((response) => {
				if (response.finalRedirect) {
					return response;
				}
				if (response.error) {
					response.finalRedirect = "/#error=login_error";
					return response;
				}
				return GetRequest(
					"/pushtoken?" + new URLSearchParams(response)
				);
			})
			.then((tokenresponse) => {
				if (tokenresponse.finalRedirect) {
					return null;
				}
				if (!tokenresponse.loggedin) {
					return null;
				}
				return "/#loggedin=true";
			})
			.then((finalRedirect) => {
				if (finalRedirect !== null) {
					window.location = finalRedirect;
				}
			});
	}, [url]);
	return null;
}
