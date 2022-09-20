const { getRepeatedSongs } = require("../api/song");
const {
	removeSongFromPlaylistFromAPI,
	addSongToPlaylist,
} = require("../api/playlist");
const { updatePlaylistSong } = require("../model");

const removeRepeatedFromSinglePlaylist = async (user, playlist) => {
	const repeatedList = await getRepeatedSongs(user, playlist);

	const repeatedTasks = repeatedList.map((repeatedSong) => {
		let addDate = null;
		const playlistSong = repeatedSong
			.getPlaylistSongs()
			.then((result) => (addDate = result.add_date));
		const removeSong = removeSongFromPlaylistFromAPI(
			user,
			repeatedSong,
			playlist
		);
		const addSong = addSongToPlaylist(user, repeatedSong, playlist);

		return playlistSong
			.then(() => removeSong)
			.then((resultRemove) => {
				if (resultRemove.error) {
					return resultRemove;
				}
				return addSong;
			})
			.then((resultAdd) => {
				if (resultAdd.error) {
					return resultAdd;
				}
				const addData = {
					active: true,
					add_date: addDate,
				};
				console.log("add data", addData);
				return updatePlaylistSong(
					playlist.id,
					repeatedSong.id,
					addData
				);
			});
	});

	return Promise.all(repeatedTasks).then((result) => {
		return { message: result, removedTotal: result.length };
	});
};

const removeRepeatedSongs = async (user) => {
	const response = { error: false, message: [], removedTotal: {} };
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		const singleResponse = await removeRepeatedFromSinglePlaylist(
			user,
			playlist
		);
		response.message.push(...singleResponse.message);
		response.removedTotal[playlist.id] = singleResponse.removedTotal;
	}
	return response;
};
module.exports = { removeRepeatedSongs };
