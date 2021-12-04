const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

const request = (req, url, method = "GET", body = null, request = null) => {
	if (!req.session) return { error: true, message: "No session available" };

	const requestOptions = request || {
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

module.exports = { request };
