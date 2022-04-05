const { Op } = require("sequelize");

const { Song, User } = require("../database");
const { request } = require("../utils");

const formatSongAPI = (song) => {
	const art = song.artists.reduce((previous, artist) => {
		previous.push(artist.name);
		return previous;
	}, []);
	const idartist = song.artists[0].id;

	return {
		id: song.id,
		name: song.name,
		artist: art.join(", "),
		idartist: idartist,
		album: song.album.name,
		action: song.uri,
	};
};
const formatSongList = (songList) => {
	return songList.map((song) => {
		const currentSong = song.track || song;
		return formatSongAPI(currentSong);
	});
};

const songIdFromURI = (songuri) => {
	const split = songuri.split(":");
	return split.pop();
};

const formatSong = (song) => {
	return {
		id: song.id,
		name: song.name,
		artist: song.artist,
		idartist: song.idartist,
		album: song.album,
		action: song.action,
	};
};

const getSong = async (access_token, idsong, userId) => {
	const currentSong = await Song.findOne({
		where: { id: idsong },
		include: {
			model: User,
			where: { id: userId },
		},
	});
	if (currentSong !== null) {
		return formatSong(currentSong);
	}
	let url = `https://api.spotify.com/v1/tracks/${idsong}`;
	const response = await request(access_token, url);
	if (response.error) {
		return response;
	}
	const newsong = formatSongAPI(response);
	const data = newsong;
	// data.iduser = userId;
	data.song_added = Date.now();
	const createdSong = await Song.findOrCreate(data).catch((err) => {
		console.error(err);
		return { error: err.message };
	});
	console.log(createdSong);

	return newsong;
};

module.exports = { getSong, formatSong, formatSongList, songIdFromURI };
