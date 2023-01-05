const { getUser: getUserAPI } = require("../spotifyapi/user");
const { User, UserSongHistory } = require("../database");
const { Op } = require("sequelize");

const createUser = (userData) => {
	return User.create(userData).catch((err) => {
		console.error("create user song error ", err);
		return { error: true, message: err.message };
	});
};

const _createUser = async (session) => {
	const response = await getUserAPI(session.access_token);
	if (response.error) {
		console.log("create user error", response);
		return response;
	}

	const thisUserById = await User.findByPk(response.id).catch((err) => {
		return { error: err.message };
	});
	if (thisUserById !== null) {
		if (thisUserById.error) {
			return thisUserById;
		}
		session.hash = thisUserById.hash;
	}
	const updatedata = {
		id: response.id,
		name: response.display_name,
		url: response.external_urls.spotify,
		image: response.images[0].url,
		country: response.country,
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

const getUser = (session) => {
	if (!session.hash) {
		return { error: "Not logged in" };
	}
	return User.findOne({
		where: {
			[Op.or]: [
				{ hash: session.hash },
				{
					access_token: session.access_token
						? session.access_token
						: "invalid",
				},
				{
					refresh_token: session.refresh_token
						? session.refresh_token
						: "invalid",
				},
			],
		},
	}).catch((err) => {
		console.error("get user error ", err);
		return { error: true, message: err.message };
	});
};

const updateUser = async (session) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		console.error("error getting user", currentUser);
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
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}

	const songsDestroyed = await UserSongHistory.destroy({
		where: { UserId: currentUser.id },
	}).catch((err) => ({
		error: err.message,
	}));
	if (songsDestroyed.error) {
		return songsDestroyed;
	}

	const userDestroyed = await currentUser
		.destroy()
		.catch((err) => ({ error: err.message }));

	if (userDestroyed.error) {
		return userDestroyed;
	}
	return true;
};

module.exports = { createUser, getUser, updateUser, deleteUser };
