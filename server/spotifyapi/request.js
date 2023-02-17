async function getFetch() {
	if (typeof window !== "undefined") return window.fetch;
	if (typeof globalThis !== "undefined") return globalThis.fetch;
	const { default: fetch } = await import("node-fetch");
	return fetch;
}

const fetch = await getFetch();

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
