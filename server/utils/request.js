const fetch = (...args) => import("node-fetch").then(({ default: fetchFunction }) => fetchFunction(...args));

const request = (req, url, method = "GET", body = null, requestOverride = null) => {
	if (!req.session) return { error: true, message: "No session available" };

	const requestOptions = requestOverride || {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + req.session.access_token,
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

module.exports = { request };
