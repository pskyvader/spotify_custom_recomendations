const { Op } = require("sequelize");
const { Playlist, UserSong, Song } = require("../database");
const { removeSongPlaylist } = require("../api/playlist");
const { myRecommendedSongs, getPlaylistSongs } = require("../api/song");
const { addUserToSong } = require("../model/song");

const addMissingSongs = async (user) => {
	console.log("--------------------------------");
	console.log("Adding missing songs to database");
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
	let allUserSongs = await UserSong.findAll({
		where: {
			UserId: userId,
			removed: false,
		},
		// include: {
		// 	model: Song,
		// },
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});
	const allUserSongsIds = allUserSongs.map((song) => song.SongId);

	for (const playlist of playlists) {
		const playlistSongsList = await getPlaylistSongs(
			fakesession,
			playlist.id
		);
		const songsToAdd = playlistSongsList.filter((usersong) => {
			return !allUserSongsIds.includes(usersong.id);
		});

		console.log(`Found ${songsToAdd.length} missing songs, Adding`);
		for (const song of songsToAdd) {
			const currentSong = await Song.findOne({
				where: { id: song.id },
			}).catch((err) =>
				console.error("Finding missing song to add", err)
			);
			//await?
			addUserToSong(currentSong, userId).catch((err) =>
				console.error("Adding missing song", err)
			);
		}
		response.message.push(`Added ${songsToAdd.length} missing songs`);
	}

	return response;
};

module.exports = { addMissingSongs };
