const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const request = async (req,url, method = "GET", body = null, request = null) => {
	const requestOptions = request || {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + req.session.access_token,
		},
		body: body,
	};
	const result = async () => {
		const response = await fetch(url, requestOptions);
		if (!response.ok) {
			const responsetext = await response.text();
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
	};
	return result();
};

module.exports = { request };
