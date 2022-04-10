const { Op } = require("sequelize");
const { request } = require("../../utils");
const { Song,User } = require("../../database");
const { getUser, getSong, songIdFromURI } = require("../../model");

const { removeSongPlaylistCache } = require("../song/getPlaylistSongs");
const {
	removeSongRemoveRecommendedCache,
} = require("../song/myRemoveRecommended");
const { addDeletedSongsCache } = require("../song/getMyDeletedSongs");

const removeSongPlaylist = async (session, songuri, playlistId) => {
	const user = await getUser(session);
	if (user.error) {
		return user;
	}
	const url =
		"https://api.spotify.com/v1/playlists/" + playlistId + "/tracks";

	const songs = {
		tracks: [{ uri: songuri }],
	};

	const response = await request(
		session.access_token,
		url,
		"DELETE",
		JSON.stringify(songs)
	);
	if (response.error) {
		return response;
	}

	const currentSong = await getSong(
		session.access_token,
		songIdFromURI(songuri),
		user.id
	);

	const updatingSong = await Song.findByPk(currentSong.id, {
		include: { model: User, where: { id: user.id } },
	});

	await updatingSong
		.addUser(user.id, {
			through: { song_removed: Date.now(), removed: true },
		})
		.catch((err) => {
			return { error: err.message };
		});

	removeSongPlaylistCache(playlistId, currentSong);
	removeSongRemoveRecommendedCache(playlistId, currentSong);
	addDeletedSongsCache(playlistId, currentSong);

	return {
		message: "success",
		snapshot_id: response.snapshot_id,
	};
};

module.exports = { removeSongPlaylist };
