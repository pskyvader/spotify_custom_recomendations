const GetRequest = async (url, method = "GET", body = null,request=null) => {
	const requestOptions = request || {
		method: method,
		headers: {
			"Content-Type": "application/json"
		},
		body: body,
	};
	return fetch(url, requestOptions).then(async (response) => {
		if (!response.ok) {
			const responsetext = await response.text();
			let responsejson = responsetext;
			try {
				responsejson = JSON.parse(responsetext);
			} finally {
				return {
					error: true,
					status: response.status,
					message: responsetext,
					url: response.url,
					detail: responsejson,
				};
			}
		}
		return response.json();
	});
};

export default GetRequest;
