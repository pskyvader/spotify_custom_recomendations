const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const { myRecommendedSongs } = require("../api/song");
const { addSongPlaylist } = require("../api/playlist");

const addToPlaylist = async (user) => {
	const fakesession = {
		hash: user.hash,
		access_token: user.access_token,
		refresh_token: user.refresh_token,
	};
	const iduser = user.id;

	const lastSong = await Song.findOne({
		where: { [Op.and]: [{ iduser: iduser }, { removed: false }] },
		order: [["song_added", "DESC"]],
	}).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	// check every 1 day
	if (
		lastSong !== null &&
		lastSong.song_added > Date.now() - 24 * 3600 * 1000
	) {
		console.log(
			"skip add to playlist, user:",
			iduser,
			"added at",
			lastSong.song_added
		);
		return { error: "skip add to playlist" };
	}

	const playlists = await Playlist.findAll({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});
	const updateResponse = playlists.every(async (playlist) => {
		const songlist = await myRecommendedSongs(fakesession, playlist.id);
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
						{ removed: true },
					],
				},
			});

			if (currentSong !== null) {
				continue;
			}

			//await ?
			await addSongPlaylist(fakesession, songInList.action, playlist.id);
			i++;
		}
	});

	if (updateResponse.error) {
		return updateResponse;
	}
};

module.exports = { addToPlaylist };
