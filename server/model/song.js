const { Op } = require("sequelize");

const { Song } = require("../database");
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
	const filteredSongs = songList.filter((song) => {
		const currentSong = song.track || song;
		return (
			typeof currentSong.is_playable === "undefined" ||
			currentSong.is_playable === true
		);
	});

	return filteredSongs.map((song) => {
		const currentSong = song.track || song;
		formatSongAPI(currentSong);
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

const getSong = async (access_token, idsong, iduser) => {
	const currentSong = await Song.findOne({
		where: { [Op.and]: [{ iduser: iduser }, { id: idsong }] },
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
	data.iduser = iduser;
	data.song_added = Date.now();
	await Song.create(data).catch((err) => {
		//upsert?
		console.error(err);
		return { error: err.message };
	});
	return newsong;
};

module.exports = { getSong, formatSong, formatSongList, songIdFromURI };
