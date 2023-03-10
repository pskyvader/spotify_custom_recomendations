require("dotenv").config();
const { getSongFeatures } = require("../spotifyapi/song");
const { getPlaylistSongs } = require("../api/playlist");
const { validateUserLogin } = require("../api/user");
const { User } = require("../database");

const getfeatures = () => {
	return User.findOne()
		.then((user) => {
			return validateUserLogin({
				hash: user.hash,
				access_token: user.access_token,
				expiration: user.expiration,
			});
		})
		.then((user) => {
			return user
				.getPlaylists({ where: { active: true } })
				.then((playlists) => {
					return { user, playlists };
				});
		})
		.then(({ user, playlists }) => {
			return getPlaylistSongs(playlists[0]).then((songList) => {
				return { user, songList };
			});
		})
		.then(({ user, songList }) => getSongFeatures(user, songList))
		.then((response) => {
			expect(response).toBeDefined();
			expect(response).not.toHaveProperty("error");
			expect(response).not.toHaveLength(0);
			// console.log("song Features: ", response.length);
			return response;
		});
};

test("Get a non empty list of song Features", getfeatures);

// getfeatures();
