const { UserSongHistory } = require("../database");

const createUserSong = async (user, song, played_date) => {
	const userCreateData = {
		played_date: played_date,
		UserId: user.id,
		SongId: song.id,
	};

	const newUserSong = await UserSongHistory.create(userCreateData).catch(
		(err) => {
			console.error("create user song error ", err);
			return { error: true, message: err.message };
		}
	);

	song.set({ last_time_used: Date.now() });
	song.save();

	return newUserSong;
};

const getUserSong = async (user, song) => {
	const currentUserSong = await UserSongHistory.findAll({
		where: { UserId: user.id, SongId: song.id },
	});
	return currentUserSong;
};

// const updateUserSong = async (
// 	iduser,
// 	idsong,
// 	data = {
// 		song_added: null,
// 		times_played: null,
// 		removed: null,
// 		removed_date: null,
// 	}
// ) => {
// 	const currentUserSong = await UserSongHistory.findOne({
// 		where: { userId: iduser, SongId: idsong },
// 	}).catch((err) => {
// 		console.error(err.message);
// 		return { error: err.message };
// 	});
// 	if (currentUserSongHistory.error) {
// 		return currentUserSong;
// 	}
// 	currentUserSongHistory.set(data);
// 	const UserSongSaved = await currentUserSong
// 		.save()
// 		.catch((err) => ({ error: err.message }));
// 	if (UserSongSaved.error) {
// 		return UserSongSaved;
// 	}
// 	return currentUserSong;
// };

const deleteUserSong = async (id) => {
	const UserSongDestroyed = await UserSongHistory.destroy({
		where: { id: id },
	}).catch((err) => ({ error: err.message }));

	if (UserSongDestroyed.error) {
		return UserSongDestroyed;
	}
	return true;
};

module.exports = {
	createUserSong,
	getUserSong,
	// updateUserSong,
	deleteUserSong,
};
