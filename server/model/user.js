const { request } = require("../utils");
const { User } = require("../database");
const { Op } = require("sequelize");

const UserlistCache = {};
const getUser = async (session) => {
	if (!session.hash) {
		console.log("No session access token", session);
		return { error: "Not logged in" };
	}
	if (UserlistCache[session.hash]) {
		return UserlistCache[session.hash];
	}

	const thisUser = await User.findOne({
		where: {
			[Op.or]: [
				{ hash: session.hash },
				{ access_token: session.access_token },
				{ refresh_token: session.refresh_token },
			],
		},
	});

	if (thisUser !== null) {
		UserlistCache[thisUser.hash] = {
			id: thisUser.id,
			name: thisUser.name,
			url: thisUser.url,
			image: thisUser.image,
			access_token: thisUser.access_token,
			refresh_token: thisUser.refresh_token,
			hash: thisUser.hash,
		};
		return UserlistCache[thisUser.hash];
	}

	const response = await request(
		session.access_token,
		"https://api.spotify.com/v1/me"
	);

	if (response.error) {
		console.log(response);
		return response;
	}
	UserlistCache[session.hash] = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		access_token: session.access_token,
		refresh_token: session.refresh_token,
		expiration: session.expiration,
		hash: session.hash,
	};

	User.upsert(UserlistCache[session.hash]).catch((err) => {
		console.log(err);
		return { error: err.message };
	});
	return UserlistCache[session.hash];
};

module.exports = { getUser };
