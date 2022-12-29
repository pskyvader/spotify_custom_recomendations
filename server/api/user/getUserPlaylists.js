const { getPlaylists } = require("../../spotifyapi/user");
const { createPlaylist, getPlaylist } = require("../../model");

const getUserPlaylists = (user) => {
	return getPlaylists(user).then((playlists) => {
		const filtered = playlists.filter((currentPlaylist) => {
			return parseInt(user.id) === parseInt(currentPlaylist.owner.id);
		});

		const playlistsPromises = filtered.map((currentPlaylist) => {
			return getPlaylist(user, currentPlaylist.id).then((playlist) => {
				if (playlist !== null) {
					return playlist;
				}
				return createPlaylist(user, currentPlay, currentPlaylist);
			});
		});
		return Promise.all(playlistsPromises);
	});
};

module.exports = { getUserPlaylists };
