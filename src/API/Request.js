const GetRequest = async (url, method = "GET", body = null) => {
	const access_token = localStorage.getItem("access_token");
	// POST request using fetch inside useEffect React hook
	const requestOptions = {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + access_token,
		},
		body: body,
	};
	return fetch(url, requestOptions).then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			return {
				error:true,
				status: response.status,
				text: response.statusText,
				response:response
			};
		}
	});
};

export default GetRequest;
