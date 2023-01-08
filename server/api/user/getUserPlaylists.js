const { getPlaylists } = require("../../spotifyapi/user");
const { createPlaylist, getPlaylist } = require("../../model");

const getUserPlaylists = (user) => {
	return getPlaylists(user).then((playlists) => {
		if (playlists.error) {
			return playlists;
		}
		const filtered = playlists.filter((currentPlaylist) => {
			return parseInt(user.id) === parseInt(currentPlaylist.UserId);
		});

		const playlistsPromises = filtered.map((currentPlaylist) => {
			return getPlaylist(user.id, currentPlaylist.id).then((playlist) => {
				if (playlist !== null) {
					if (playlist.error) {
						return playlist;
					}
					return playlist.update({
						...currentPlaylist,
						UserId: user.id,
					});
				}
				return createPlaylist(currentPlaylist);
			});
		});
		return Promise.allSettled(playlistsPromises).then((playlists) => {
			console.log(playlists);
			return playlists.value;
		});
	});
};

module.exports = { getUserPlaylists };
