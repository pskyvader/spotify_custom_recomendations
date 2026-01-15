const { getSongs } = require("../../spotifyapi/playlist");
const { getSong } = require("./getSong");
const cleanName = (name) => {
	// remove parens and brackets and their content
	let clean = name
		.replace(/\s*\(.*?\)\s*/g, "")
		.replace(/\s*\[.*?\]\s*/g, "");
	// remove non-alphanumeric and lowercase
	return clean.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

const getRepeatedSongs = async (user, playlist) => {
	const songList = await getSongs(user.access_token, playlist);
	// group repeated songs
	const clusters = [];

	songList.forEach((currentSong) => {
		const currentNameNorm = cleanName(currentSong.name);

		const cluster = clusters.find((c) => {
			const kept = c[0];
			// 1. Exact ID match (Same song)
			if (kept.id === currentSong.id) return true;

			// 2. Same Artist (Primary)
			if (kept.idartist === currentSong.idartist) {
				// 2a. Exact Name match (Different album/version potentially)
				if (kept.name === currentSong.name) return true;

				// 2b. Very Similar Name match (Normalization handles case, parens, brackets, punctuation)
				const keptNameNorm = cleanName(kept.name);
				if (keptNameNorm === currentNameNorm) return true;
			}
			return false;
		});

		if (cluster) {
			cluster.push(currentSong);
		} else {
			clusters.push([currentSong]);
		}
	});

	// Filter only groups with duplicates and flatten
	const duplicates = clusters
		.filter((cluster) => cluster.length > 1)
		.flat();

	const formattedFiltered = await Promise.allSettled(
		duplicates.map((song) => {
			return getSong(user.access_token, song.id, song);
		})
	);

	const unique = [
		...new Map(
			formattedFiltered.map((song) => {
				return [song.id, song.value];
			})
		).values(),
	];
	return unique;
};

module.exports = { getRepeatedSongs };
