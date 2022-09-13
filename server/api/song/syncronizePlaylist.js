const { getPlaylistSongsFromAPI } = require("./getPlaylistSongsFromAPI");
const { getPlaylistSongs } = require("./getPlaylistSongs");

const {
	getPlaylistSong,
	updatePlaylistSong,
	getSong,
} = require("../../model/");

const syncronizePlaylist = async (user, playlist) => {
	const currentSongList = await getPlaylistSongs(playlist);
	const songListUpdated = await getPlaylistSongsFromAPI(user, playlist);

	//it's not playlist-song, only "Song" in database
	const syncronizeSongsPromise = songListUpdated.map((currentSong) => {
		return getSong(user.access_token, currentSong.id, currentSong);
	});

	const currentSongListIds = currentSongList.map(
		(currentSong) => currentSong.id
	);

	const songListUpdatedIds = songListUpdated.map(
		(currentSong) => currentSong.id
	);

	const syncronizeRemoveSongListPromise = currentSongList.map(
		(currentSong) => {
			if (songListUpdatedIds.includes(currentSong.id)) {
				return null;
			}
			const deleteData = {
				active: false,
				removed_date: Date.now(),
			};
			return updatePlaylistSong(playlist, currentSong, deleteData);
		}
	);

	const syncronizeAddSongListPromise = songListUpdated.map((currentSong) => {
		if (currentSongListIds.includes(currentSong.id)) {
			return null;
		}
		return getSong(user.access_token, currentSong.id, currentSong).then(
			(newsong) => {
				return getPlaylistSong(playlist, newsong);
			}
		);
	});
	return Promise.all(syncronizeSongsPromise)
		.then(
			Promise.all(syncronizeRemoveSongListPromise).then(
				Promise.all(syncronizeAddSongListPromise),
				{
					error: true,
					message: "Syncronize Add songs error",
				}
			),
			{
				error: true,
				message: "Syncronize Remove songs error",
			}
		)
		.finally({
			error: false,
			message: "Syncronize completed",
		});
};

const syncronizeMultiplePlaylists = async (user) => {
	const response = { error: false, message: [] };
	const playlists = await user.getPlaylists({ where: { active: true } });
	for (const playlist of playlists) {
		response.message.push(await syncronizePlaylist(user, playlist));
	}
	return response;
};

module.exports = { syncronizePlaylist, syncronizeMultiplePlaylists };
