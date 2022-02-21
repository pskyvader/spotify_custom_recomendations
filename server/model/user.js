const { request } = require("../utils");
const { User } = require("../database");

const UserlistCache = {};
const getUser = async (session) => {
	if (!session.access_token) {
		console.log("No session access token", session);
		return { error: "Not logged in" };
	}
	const access_token = session.access_token;
	if (UserlistCache[access_token]) {
		return UserlistCache[access_token];
	}

	const thisUser = await User.findOne({
		where: {
			access_token: access_token,
		},
	});
	
	if (thisUser !== null) {
		UserlistCache[access_token] = {
			id: thisUser.id,
			name: thisUser.name,
			url: thisUser.url,
			image: thisUser.image,
			access_token: access_token,
			refresh_token: session.refresh_token,
		};
		return UserlistCache[access_token];
	}
	

	const response = await request(
		access_token,
		"https://api.spotify.com/v1/me"
	);
	
	if (response.error) {
		console.log(response);
		return response;
	}

	UserlistCache[access_token] = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		access_token: access_token,
		refresh_token: session.refresh_token,
	};

	const defaultValues = {
		...UserlistCache[access_token],
		expiration: session.expiration,
	};

	User.upsert(defaultValues).catch((err) => {
		console.log(err);
		return { error: err.message };
	});
	return UserlistCache[access_token];
};

module.exports = { getUser };
