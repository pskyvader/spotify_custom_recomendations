const fetch = (...args) =>
	import("node-fetch").then(({ default: fetchFunction }) =>
		fetchFunction(...args)
	);
const request = (
	access_token,
	url,
	method = "GET",
	body = null,
	requestOverride = null
) => {
	const requestOptions = requestOverride || {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + access_token,
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
				url: response.url,
				request_url: url,
				requestOptions: requestOptions,
			};
			try {
				finalresponse.detail = JSON.parse(responsetext);
				// console.log(finalresponse);
				return finalresponse;
			} catch (error) {
				// console.log(finalresponse);
				return finalresponse;
			}
		}
		return response.json();
	});
};

module.exports = { request };
