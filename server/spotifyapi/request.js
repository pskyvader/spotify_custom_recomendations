const fetch = (...args) =>
	import("node-fetch").then(({ default: fetchFunction }) => {
		return fetchFunction(...args);
	});
const request = (
	access_token,
	url,
	method = "GET",
	body = null,
	headersOverride = null
) => {
	const requestOptions = {
		method: method,
		headers: headersOverride || {
			"Content-Type": "application/json",
			Authorization: "Bearer " + access_token,
		},
		body: body,
	};

	return fetch(url, requestOptions)
		.then((response) => {
			if (!response.ok) {
				return response
					.text()
					.then((responsetext) => {
						const finalresponse = {
							error: true,
							status: response.status,
							message: responsetext,
							url: response.url,
							request_url: url,
							requestOptions: requestOptions,
						};
						try {
							finalresponse.detail = JSON.parse(responsetext);
							return finalresponse;
						} catch (error) {
							return finalresponse;
						}
					})
					.catch((err) => {
						return {
							...response,
							error: true,
							message: err.message,
						};
					});
			}
			return response.json();
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { request };
