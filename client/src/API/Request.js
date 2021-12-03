const GetRequest = async (url, method = "GET", body = null,request=null) => {
	const requestOptions = request || {
		method: method,
		headers: {
			"Content-Type": "application/json"
		},
		body: body,
	};
	const result= async () => {
		const response = await fetch(url, requestOptions);
		if (!response.ok) {
			const responsetext= await response.text();
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
		}
		return response.json();
	}
	
	return await result;
};

export default GetRequest;
