const { getPlaylists } = require("../../spotifyapi/user");
const { createPlaylist, getPlaylist } = require("../../model");

const getUserPlaylists = (user) => {
	return getPlaylists(user.access_token).then((playlists) => {
		if (playlists.error) {
			return playlists;
		}
		const filtered = playlists.filter((currentPlaylist) => {
			return parseInt(user.id) === parseInt(currentPlaylist.UserId);
		});
		let count = 0;
		const playlistsPromises = filtered.map((currentPlaylist) => {
			const index = count++;
			return getPlaylist(user.id, currentPlaylist.id)
				.then((playlist) => {
					if (playlist !== null) {
						if (playlist.error) {
							return playlist;
						}
						return playlist.update({
							...currentPlaylist,
							UserId: user.id,
							active: playlist.active,
						});
					}
					return createPlaylist({
						...currentPlaylist,
						active: false,
					});
				})
				.then((response) => ({ response, index }));
		});
		return Promise.allSettled(playlistsPromises).then((playlists) => {
			const responses = playlists
				.sort((a, b) => {
					return a.value.index - b.value.index;
				})
				.map((playlistresponse) => {
					return playlistresponse.value.response;
				});
			return responses;
		});
	});
};

module.exports = { getUserPlaylists };
