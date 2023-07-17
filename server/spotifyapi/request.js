const getFetch = async () => {
	if (typeof fetch === "function") {
		// console.log("basic", fetch);
		return fetch;
	}
	if (
		typeof globalThis !== "undefined" &&
		typeof globalThis.fetch === "function"
	) {
		// console.log("global", globalThis.fetch);
		return globalThis.fetch;
	}
	if (typeof window !== "undefined" && typeof window.fetch === "function") {
		// console.log("window", window.fetch);
		return window.fetch;
	}
	const fetchModule = await import("node-fetch");
	// console.log("import", fetchModule.default);
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
	// console.log("getFetch", fetch);

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
						message: {
							responsetext,
							status: response.status,
							url: response.url,
							request_url: url,
							requestOptions: requestOptions,
						},
					};
					try {
						finalresponse.message.detail = JSON.parse(responsetext);
						finalresponse.message = JSON.parse(
							finalresponse.message
						);

						return finalresponse;
					} catch (error) {
						return finalresponse;
					}
				})
				.catch((err) => {
					return {
						error: true,
						message: err.message + ", URL:" + url,
						...response,
					};
				});
		})
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { request };
