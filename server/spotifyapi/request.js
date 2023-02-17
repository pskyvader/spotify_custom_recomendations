const getFetch = async () => {
	if (typeof fetch === "function") return fetch;
	if (
		typeof globalThis !== "undefined" &&
		typeof globalThis.fetch === "function"
	) {
		return globalThis.fetch;
	}
	if (typeof window !== "undefined" && typeof window.fetch === "function") {
		return window.fetch;
	}
	const fetchModule = await import("node-fetch");
	return fetchModule.default;
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
