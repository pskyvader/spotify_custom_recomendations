const { getRepeatedSongs } = require("../api/song");
const {
	removeSongFromPlaylistFromAPI,
	addSongToPlaylistFromAPI,
	addSongToPlaylist,
} = require("../api/playlist");
const { updatePlaylistSong } = require("../model");

const removeRepeatedFromSinglePlaylist = async (user, playlist) => {
	const repeatedList = await getRepeatedSongs(user, playlist);

	const repeatedTasks = repeatedList.map((repeatedSong) => {
		const playlistSong = repeatedSong.getPlaylistSongs();
		const removeSong = removeSongFromPlaylistFromAPI(
			user,
			repeatedSong,
			playlist
		);
		const addSongAPI = addSongToPlaylistFromAPI(
			user,
			playlist,
			repeatedSong
		);
		const addSong = addSongToPlaylist(playlist, repeatedSong);

		return playlistSong
			.then((resultPlaylistSongs) => {
				return removeSong.then((result) => {
					result.add_date = resultPlaylistSongs[0].add_date;
					return result;
				});
			})
			.then((resultRemove) => {
				if (resultRemove.error) return resultRemove;

				return addSongAPI.then((result) => {
					result.add_date = resultRemove.add_date;
					return result;
				});
			})
			.then((resultAddAPI) => {
				if (resultAddAPI.error) return resultAddAPI;

				return addSong.then((result) => {
					result.add_date = resultAddAPI.add_date;
					return result;
				});
			})
			.then((resultAdd) => {
				if (resultAdd.error) return resultAdd;

				const addData = {
					active: true,
					add_date: resultAdd.add_date,
				};
				return updatePlaylistSong(
					playlist.id,
					repeatedSong.id,
					addData
				);
			})
			.then((finalresult) => {
				if (finalresult.error) return finalresult;

				return `Removed repeated song ${repeatedSong.name}`;
			});
	});

	return Promise.all(repeatedTasks).then((result) => {
		return { message: result, removedTotal: result.length };
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
