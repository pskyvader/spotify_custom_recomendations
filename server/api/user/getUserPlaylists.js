const { getPlaylists } = require("../../spotifyapi/user");
const { createPlaylist, getPlaylist } = require("../../model");

const getUserPlaylists = (user) => {
	return getPlaylists(user).then((playlists) => {
		console("UserPlaylists", playlists);
		if (playlists.error) {
			return playlists;
		}
		const filtered = playlists.filter((currentPlaylist) => {
			return parseInt(user.id) === parseInt(currentPlaylist.owner.id);
		});

		const playlistsPromises = filtered.map((currentPlaylist) => {
			return getPlaylist(user.id, currentPlaylist.id).then((playlist) => {
				if (!playlist.error) {
					return playlist;
				}
				return createPlaylist(currentPlaylist);
			});
		});
		return Promise.all(playlistsPromises);
	});
};

module.exports = { getUserPlaylists };
