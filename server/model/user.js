const { User, UserSongHistory } = require("../database");
const { Op } = require("sequelize");

const createUser = (userData) => {
	return User.create(userData).catch((err) => {
		console.error("create user song error ", err);
		return { error: true, message: err.message };
	});
};

const getUser = (session) => {
	const options = [];
	if (session.hash) {
		options.push({ hash: session.hash });
	}
	if (session.id) {
		options.push({ id: session.id });
	}
	if (session.access_token) {
		options.push({ access_token: session.access_token });
	}
	if (session.refresh_token) {
		options.push({ refresh_token: session.refresh_token });
	}

	return User.findOne({
		where: {
			[Op.or]: options,
		},
	}).catch((err) => {
		console.error("get user error ", err);
		return { error: true, message: err.message };
	});
};

// const updateUser = async (session) => {
// 	const currentUser = await getUser(session);
// 	if (currentUser.error) {
// 		console.error("error getting user", currentUser);
// 		return currentUser;
// 	}
// 	const updateData = {
// 		access_token: session.access_token,
// 		refresh_token: session.refresh_token,
// 		expiration: session.expiration,
// 		hash: session.hash,
// 	};
// 	currentUser.set(updateData);
// 	const userSaved = await currentUser
// 		.save()
// 		.catch((err) => ({ error: err.message }));
// 	if (userSaved.error) {
// 		return userSaved;
// 	}
// 	return currentUser;
// };

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

module.exports = {
	createUser,
	getUser,
	// updateUser,
	deleteUser,
};
