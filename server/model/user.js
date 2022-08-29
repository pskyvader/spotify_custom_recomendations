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

	const thisUserById = await User.findByPk(response.id).catch((err) => {
		return { error: err.message };
	});
	if (thisUserById.error) {
		return thisUserById;
	}
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
	if (currentUser.error) {
		return currentUser;
	}
	const updateData = {
		access_token: session.access_token,
		refresh_token: session.refresh_token,
		expiration: session.expiration,
		hash: session.hash,
	};
	currentUser.set(updateData);
	const userSaved = await currentUser
		.save()
		.catch((err) => ({ error: err.message }));
	if (userSaved.error) {
		return userSaved;
	}
	return currentUser;
};

const deleteUser = async (session) => {
	const currentUser = getUser(session);
	if (currentUser.error) {
		return currentUser;
	}

	const userDestroyed = await currentUser
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (userDestroyed.error) {
		return userDestroyed;
	}
	return true;
};

module.exports = { getUser, updateUser, deleteUser };
