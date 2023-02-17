const getFetch = () => {
	if (typeof window !== "undefined") {
		return Promise.resolve(window.fetch);
	}
	if (typeof globalThis !== "undefined") {
		return Promise.resolve(globalThis.fetch);
	}
	return import("node-fetch").then((module) => module.default || module);
};
// fetch = (...args) =>
// 	import("node-fetch").then(({ default: fetchFunction }) => {
// 		return fetchFunction(...args);
// 	});

const request = async (
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
	const fetch = await getFetch();

	return fetch(url, requestOptions)
		.then((response) => {
			if (response.ok) {
				return response.json();
			}
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
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { request };
