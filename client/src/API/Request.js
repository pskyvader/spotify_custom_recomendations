const GetRequest = async (url, method = "GET", body = null,request=null) => {
	const access_token = localStorage.getItem("access_token");
	const requestOptions = request || {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + access_token,
		},
		body: body,
	};
	console.log(requestOptions);
	return fetch(url, requestOptions).then((response) => {
		if (!response.ok) {
			return response.text().then((responsetext) => {
				let responsejson = responsetext;
				try {
					responsejson = JSON.parse(responsetext);
				} finally {
					return {
						error: true,
						status: response.status,
						text: responsetext,
						url: response.url,
						detail: responsejson,
					};
				}
			});
		}
		return response.json();
	});
};

export default GetRequest;
