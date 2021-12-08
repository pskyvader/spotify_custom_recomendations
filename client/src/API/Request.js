const GetRequest = (url, method = "GET", body = null, requestOverride = null) => {
	const requestOptions = requestOverride || {
		method: method,
		headers: {
			"Content-Type": "application/json",
		},
		body: body,
	};

	return fetch(url, requestOptions).then(async (response) => {
		if (!response.ok) {
			const responsetext = await response.text();
			let finalresponse = {
				error: true,
				status: response.status,
				message: responsetext,
				url: response.url
			};
			try {
				finalresponse.detail=JSON.parse(responsetext);
				return finalresponse;
			}catch(error){
				return finalresponse;
			}
		}
		return response.json();
	});
};

export default GetRequest;
