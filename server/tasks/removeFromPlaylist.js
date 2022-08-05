const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRemoveRecommended, getPlaylistSongs } = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const _MAX_SONGS_PER_PLAYLIST = 200;
const _MIN_SONGS_PER_PLAYLIST = 50;

const removeFromPlaylist = async (user) => {
	const response = { error: false, message: [] };
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const userId = user.id;

	const playlists = await Playlist.findAll({
		where: {
			[Op.and]: [{ iduser: userId }, { active: true }],
		},
	});

	for (const playlist of playlists) {
		const playlistSongsList = await getPlaylistSongs(
			fakesession,
			playlist.id,
			true
		);
		if (playlistSongsList.error) {
			return playlistSongsList;
		}
		const songlist = await myRemoveRecommended(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		response.message.push(
			`Max songs available for deletion: ${songlist.length} of ${playlistSongsList.length}`
		);
		let songsToRemove = 5 + Math.floor(Math.random() * 5);
		if (playlistSongsList.length < _MIN_SONGS_PER_PLAYLIST) {
			songsToRemove -= 2;
		}
		if (playlistSongsList.length > _MAX_SONGS_PER_PLAYLIST) {
			songsToRemove += 2;
		}

		let i = 0;
		for (const songInList of songlist) {
			if (i >= songsToRemove) {
				break;
			}
			const removeResponse = await removeSongPlaylist(
				fakesession,
				songInList.action,
				playlist.id
			);
			if (removeResponse.error) {
				response.error = true;
				response.message.push(
					`Error removing song ${songInList.name} from playlist ${playlist.name}`
				);
				response.message.push(JSON.stringify(removeResponse));
			} else {
				response.message.push(`Removed song: ${songInList.name}`);
			}
			i++;
		}
	}

	return response;
};

module.exports = { removeFromPlaylist };
