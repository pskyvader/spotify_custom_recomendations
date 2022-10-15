import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GetRequest from "../API/Request";

export default function Callback(props) {
	// const [redirect, SetRedirect] = useState(null);
	const navigate = useNavigate();
	const url = "/authorizeuser" + useLocation().search;
	console.log(url);
	useEffect(() => {
		// if (redirect !== null) {
		// 	return;
		// }
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
				console.log(data);
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
					return tokenresponse.finalRedirect;
				}
				if (!tokenresponse.loggedin) {
					return "/#error=push_token_error";
				}
				return "/#loggedin=true";
			})
			.finally((finalRedirect) => {
				console.log(finalRedirect);
				navigate(finalRedirect);
			});
	}, [url, navigate]);

	// if (redirect) {
	// 	window.location = redirect;
	// }

	return null;
}
