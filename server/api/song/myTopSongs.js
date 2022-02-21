const myTopSongs = async (session) => {
	const currentUser = getUser(session);
	if (currentUser.error) {
		return currentUser;
	}
	const access_token = session.access_token;

	if (meTopResult[access_token]) {
		return meTopResult[access_token];
	}

	let url =
		"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term";
	let items = [];
	while (url) {
		const response = await request(session, url);
		if (response.error) {
			console.log(response);
			return response;
		}
		url = response.next;
		items.push(...response.items);
	}
	meTopResult[access_token] = formatSongList(items);
	return meTopResult[access_token];
};

module.exports = { myTopSongs };
