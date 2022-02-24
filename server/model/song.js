const { Op } = require("sequelize");

const { Song } = require("../database");
const { getUser } = require("./user");
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
	// const formattedList = [];
	// songList.forEach((song) => {
	// 	const currentSong = song.track || song;
	// 	formattedList.push(formatSongAPI(currentSong));
	// });
	return songList.map((song) => formatSongAPI(song.track || song));
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

const getSong = async (session, idsong) => {
	const user = await getUser(session);
	if (user.error) {
		return user;
	}
	const currentSong = await Song.findOne({
		where: { [Op.and]: [{ iduser: user.id }, { id: idsong }] },
	});
	if (currentSong !== null) {
		return formatSong(currentSong);
	}
	let url = `https://api.spotify.com/v1/tracks/${idsong}`;
	const response = await request(session.access_token, url);
	if (response.error) {
		return response;
	}
	const newsong = formatSongAPI(response);
	const data = newsong;
	data.iduser = user.id;
	data.song_added = Date.now();
	await Song.upsert(data).catch((err) => {
		return { error: err.message };
	});
	return newsong;
};

module.exports = { getSong, formatSong, formatSongList, songIdFromURI };
