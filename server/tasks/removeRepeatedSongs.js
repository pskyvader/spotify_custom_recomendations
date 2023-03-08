const { getRepeatedSongs } = require("../api/song");
const {
	removeSongFromPlaylist,
	addSongToPlaylist,
} = require("../api/playlist");
const { updatePlaylistSong } = require("../model");

const removeRepeatedFromSinglePlaylist = async (user, playlist) => {
	const repeatedList = await getRepeatedSongs(user, playlist);

	const repeatedTasks = repeatedList.map((repeatedSong) => {
console.log("repeated song:",repeatedSong);
		const playlistSong = repeatedSong.getPlaylistSongs();
		const removeSong = removeSongFromPlaylist(
			user.access_token,
			repeatedSong,
			playlist
		);
		const addSong = addSongToPlaylist(
			user.access_token,
			playlist,
			repeatedSong
		);

		return playlistSong
			.then((responsePlaylistSongs) => {
				return removeSong.then((response) => {
					response.add_date = responsePlaylistSongs[0].add_date;
					return response;
				});
			})
			.then((responseRemove) => {
				if (responseRemove.error) return responseRemove;

				return addSong.then((response) => {
					response.add_date = responseAddAPI.add_date;
					return response;
				});
			})
			.then((responseAdd) => {
				if (responseAdd.error) return responseAdd;

				const addData = {
					active: true,
					add_date: responseAdd.add_date,
				};
				return updatePlaylistSong(
					playlist.id,
					repeatedSong.id,
					addData
				);
			})
			.then((finalresponse) => {
				if (finalresponse.error) return finalresponse;

				return `Removed repeated song ${repeatedSong.name}`;
			});
	});

	return Promise.all(repeatedTasks).then((response) => {
		return { message: response, removedTotal: response.length };
	});
};

const removeRepeatedSongs = async (user) => {
	const response = {
		error: false,
		message: ["Remove Repeated: "],
		removedTotalRepeated: {},
	};
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		const singleResponse = await removeRepeatedFromSinglePlaylist(
			user,
			playlist
		);
		response.message.push(...singleResponse.message);
		response.removedTotalRepeated[playlist.id] =
			singleResponse.removedTotal;
	}
	return response;
};
module.exports = { removeRepeatedSongs };
