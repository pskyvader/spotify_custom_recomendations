const { request } = require("../utils");
const { User } = require("../database");
const { Op } = require("sequelize");

const createUser = async (session) => {
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
		return { error: err.message };
	});
	return currentUser;
};

const getUser = async (session) => {
	if (!session.hash) {
		return { error: "Not logged in" };
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
		return thisUser;
	}
	return createUser(session);
};

const updateUser = async (session) => {
	const currentUser = getUser(session);
	if (response.error) {
		return response;
	}
	const updateData = {
		access_token: session.access_token,
		refresh_token: session.refresh_token,
		expiration: session.expiration,
		hash: session.hash,
	};

	return null;
};

const deleteUser = async (session) => {
	return null;
};

module.exports = { getUser };
