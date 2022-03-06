const { request } = require("../utils");
const { User } = require("../database");

const UserlistCache = {};
const getUser = async (session) => {
	if (!session.hash) {
		console.log("No session access token", session);
		return { error: "Not logged in" };
	}
	const hash = session.hash;
	if (UserlistCache[hash]) {
		return UserlistCache[hash];
	}

	const thisUser = await User.findOne({
		where: {
			hash: hash,
		},
	});

	if (thisUser !== null) {
		UserlistCache[hash] = {
			id: thisUser.id,
			name: thisUser.name,
			url: thisUser.url,
			image: thisUser.image,
			access_token: session.access_token,
			refresh_token: session.refresh_token,
			hash: session.hash,
		};
		return UserlistCache[hash];
	}

	const response = await request(
		session.access_token,
		"https://api.spotify.com/v1/me"
	);

	if (response.error) {
		console.log(response);
		return response;
	}

	UserlistCache[hash] = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		access_token: session.access_token,
		refresh_token: session.refresh_token,
		expiration: session.expiration,
		hash: hash,
	};

	User.upsert(UserlistCache[hash]).catch((err) => {
		console.log(err);
		return { error: err.message };
	});
	return UserlistCache[hash];
};

module.exports = { getUser };
