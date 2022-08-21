const { Op } = require("sequelize");

const { getPlaylistSongs } = require("./getPlaylistSongs");
const { myTopSongs } = require("./myTopSongs");
const { myApiRecommended } = require("./myApiRecommended");
const { getUser } = require("../../model");
const { myRecentSongs } = require("./myRecentSongs");
const { subtractById } = require("../../utils");
const { Song, UserSong } = require("../../database");

const recommended = {};
let lastGetResult = null;

//week in ms
const week = 604800000;
const hour = 3600000;

const addSongRecommendedCache = (playlistId, song) => {
	if (recommended[playlistId]) {
		recommended[playlistId].unshift(song);
	}
};
const removeSongRecommendedCache = (playlistId, song) => {
	if (recommended[playlistId]) {
		const songindex = recommended[playlistId].findIndex(
			(currentSong) => currentSong.id === song.id
		);
		if (songindex !== -1) {
			recommended[playlistId].splice(songindex, 1);
		}
	}
};

const myRecommendedSongs = async (session, playlistId) => {
	const currentUser = await getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;
	if (recommended[playlistId] && lastGetResult > Date.now() - hour) {
		return recommended[playlistId];
	}

	let currentPlaylist = await getPlaylistSongs(session, playlistId);
	if (currentPlaylist.error) {
		return currentPlaylist;
	}

	// remove repeated ids from currentPlaylist array
	const repeatedSongs = currentPlaylist.filter(
		(currentSong, index, self) =>
			self.findIndex((song) => song.id === currentSong.id) !== index
	);

	if (repeatedSongs.length > 0) {
		console.log(
			`Songs before remove repeated ids: ${currentPlaylist.length}`
		);
		const repeatedSongsIds = repeatedSongs.map(
			(currentSong) => currentSong.id
		);

		currentPlaylist = [
			...currentPlaylist.filter(
				(currentSong) => !repeatedSongsIds.includes(currentSong.id)
			),
			...repeatedSongsIds,
		];

		console.log(
			`Songs after remove repeated ids: ${currentPlaylist.length} || ${repeatedSongs.length}`
		);

		console.log(
			`Repeated Songs:\n ${repeatedSongs
				.map((song) => song.name)
				.join("\n, ")}`
		);
	}

	// Recent: get playlist songs ids and played more recently than 1 week ago
	const RecentSongs = await UserSong.findAll({
		where: {
			UserId: currentUser.id,
			song_last_played: {
				[Op.gte]: Date.now() - 1 * week,
			},
		},
		sort: [["song_last_played", "DESC"]],
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	const topSongs = await myTopSongs(access_token);
	if (topSongs.error) {
		return topSongs;
	}

	const topSongsIds = topSongs.map((song) => song.id);

	const RecentSongsIds = RecentSongs.map((currentSong) => {
		return currentSong.SongId;
	});

	//Recommended songs: get playlist songs in recent playlist that are in current playlist, or in top songs
	let recommendedSongs = [
		...currentPlaylist.filter((currentSong) => {
			return topSongsIds.includes(currentSong.id);
		}),
		...currentPlaylist
			.filter((currentSong) => {
				return RecentSongsIds.includes(currentSong.id);
			})
			.reverse(),
	];

	if (recommendedSongs.length === 0) {
		console.log(
			`No recommended songs for playlist ${playlistId}, getting top songs`
		);
		recommendedSongs = topSongs;
	}

	const recommendedTracks = await myApiRecommended(
		access_token,
		recommendedSongs
	);
	if (recommendedTracks.error) {
		return recommendedTracks;
	}

	const removedSongs = await UserSong.findAll({
		where: {
			UserId: currentUser.id,
			removed: true,
		},
		raw: true,
		nest: true,
	}).catch((err) => {
		return { error: err.message };
	});

	//remove songs recently removed
	const recommendedTracksFiltered = recommendedTracks.filter(
		(currentSong) => {
			return !removedSongs.find((song) => song.id === currentSong.id);
		}
	);

	recommended[playlistId] = recommendedTracksFiltered;
	lastGetResult = Date.now();
	return recommended[playlistId];
};

module.exports = {
	myRecommendedSongs,
	addSongRecommendedCache,
	removeSongRecommendedCache,
};
