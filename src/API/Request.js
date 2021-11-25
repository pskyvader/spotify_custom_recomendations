const GetRequest = async (url, method = "GET", body = null) => {
	const access_token = localStorage.getItem("access_token");
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
			return response.text().then((responsetext) => {
				let responsejson = "Parse Error";
				try {
					responsejson = JSON.parse(responsetext);
				} catch (error) {
					console.log(error);
				}

				return {
					error: true,
					status: response.status,
					text: responsetext,
					url: response.url,
					detail: responsejson,
				};
			});
		}
	});
};

export default GetRequest;
