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
			return response.json().then((responsejson)=>{
				return {
					error:true,
					status: response.status,
					text: responsejson.error.message,
					url:response.url,
					detail:responsejson,
				};
			})
			
		}
	});
};

export default GetRequest;
