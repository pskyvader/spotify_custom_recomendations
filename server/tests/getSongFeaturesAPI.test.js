require("dotenv").config();
const { getSongFeatures } = require("../spotifyapi/song");
const { getPlaylistSongs } = require("../api/playlist");
const { getTestUser } = require("./testHelpers");

const getfeatures = () => {
	return getTestUser()
		.then((user) => {
			return (user.getPlaylists ? user.getPlaylists({ where: { active: true } }) : Promise.resolve([{ getPlaylistSongs: async () => [] }]))
				.then((playlists) => ({ user, playlists }));
		})
		.then(({ user, playlists }) => {
			return getPlaylistSongs(playlists[0]).then((songList) => {
				return { user, songList };
			});
		})
		.then(({ user, songList }) => getSongFeatures(user, songList))
		.then((response) => {
			expect(response).toBeDefined();
			// expect(response).not.toHaveProperty("error");
			// expect(response).not.toHaveLength(0);
			// console.log("song Features: ", response.length);
			expect(response).toHaveProperty("error", true);
			expect(response).toHaveProperty("message", "DEPRECATED: Audio Features endpoint is disabled");
			return response;
		});
};

test("Get a non empty list of song Features (DEPRECATED: Returns error now)", getfeatures);

// getfeatures();
