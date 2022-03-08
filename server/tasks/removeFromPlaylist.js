const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRemoveRecommended } = require("../api/song");
const { removeSongPlaylist } = require("../api/playlist");

const removeFromPlaylist = async (user) => {
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const iduser = user.id;

	const lastSong = await Song.findOne({
		where: {
			[Op.and]: [{ iduser: iduser }, { removed: true }],
		},
		order: [["song_removed", "DESC"]],
	}).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	// check every 1 day
	if (
		lastSong !== null &&
		lastSong.song_removed > Date.now() - 24 * 3600 * 1000
	) {
		console.log(
			"skip remove from playlist, user:",
			iduser,
			"removed at",
			lastSong.song_removed
		);
		return { error: "skip remove from playlist" };
	}

	const playlists = await Playlist.findAll({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});

	const updateResponse = playlists.every(async (playlist) => {
		const songlist = await myRemoveRecommended(fakesession, playlist.id);
		if (songlist.error) {
			return songlist;
		}
		let i = 0;
		for (const songInList of songlist) {
			if (i > 5) {
				break;
			}
			const currentSong = await Song.findOne({
				where: {
					[Op.and]: [
						{ iduser: iduser },
						{ id: songInList.id },
						{ removed: false },
					],
				},
			});
			if (
				currentSong !== null &&
				currentSong.song_added > Date.now() - 604800000
			) {
				continue;
			}
			//await ?
			removeSongPlaylist(fakesession, songInList.action, playlist.id);
			i++;
		}
	});

	if (updateResponse.error) {
		return updateResponse;
	}
};

module.exports = { removeFromPlaylist };
