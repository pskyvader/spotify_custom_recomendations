const { Op } = require("sequelize");
const { Playlist, UserSong, Song } = require("../database");
const { removeSongPlaylist } = require("../api/playlist");
const { myRecommendedSongs, getPlaylistSongs } = require("../api/song");

const removeMissingSongs = async (user) => {
	console.log("--------------------------------");
	console.log("Removing missing songs");
	const response = { error: false, message: "" };
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
	let allUserSongs = await UserSong.findAll({
		where: {
			UserId: userId,
		},
		include: {
			model: Song,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	for (const playlist of playlists) {
		const playlistSongsList = await getPlaylistSongs(
			fakesession,
			playlist.id
		);
		const playlistSongsListIds = playlistSongsList.map((song) => song.id);

		allUserSongs = allUserSongs.filter((usersong) => {
			return !playlistSongsListIds.includes(usersong.SongId);
		});
	}
	console.log(`Found ${allUserSongs.length} missing songs, removing`);

	for (const usersong of allUserSongs) {
		//await?
		UserSong.update(
			{
				song_removed: Date.now(),
				removed: true,
			},
			{ where: { id: usersong.id } }
		).catch((err) => console.error("Removing missing song", err));
	}
	response.message = `Removed ${allUserSongs.length} missing songs`;

	return response;
};

module.exports = { removeMissingSongs };
