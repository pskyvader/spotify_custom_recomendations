const { request } = require("../utils");
const { User } = require("../database");
const { Op } = require("sequelize");

const UserlistCache = {};




const getUser = async (session, force = false) => {
	if (!session.hash) {
		// console.log("No session Hash", session);
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

	if (thisUser !== null && force === false) {
		UserlistCache[thisUser.hash] = thisUser;
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

	const thisUserById = await User.findByPk(response.id);
	if (thisUserById !== null) {
		session.hash = thisUserById.hash;
	}
	const updatedata = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		access_token: session.access_token,
		refresh_token: session.refresh_token,
		expiration: session.expiration,
		hash: session.hash,
	};

	const [currentUser] = await User.upsert(updatedata).catch((err) => {
		console.log("user Upsert", err);
		return { error: err.message };
	});
	// const thisUserById = await User.findByPk(response.id);
	UserlistCache[session.hash] = currentUser;

	return UserlistCache[session.hash];
};

module.exports = { getUser };
