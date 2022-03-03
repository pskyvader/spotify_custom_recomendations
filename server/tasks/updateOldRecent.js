const { Op } = require("sequelize");
const { Playlist, Song } = require("../database");
const updateOldRecent = async (access_token, iduser) => {
	const playlists = await Playlist.getall({
		where: {
			[Op.and]: [{ iduser: iduser }, { active: true }],
		},
	});

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

	await Song.update(
		{ removed: true, song_removed: Date.now() },
		{
			where: {
				[Op.and]: [
					{ removed: false },
					{ song_last_played: { [Op.lt]: Date.now() - 604800000 } },
				],
			},
		}
	).catch((err) => {
		return { error: err.message };
	});
};

module.exports = { updateOldRecent };
