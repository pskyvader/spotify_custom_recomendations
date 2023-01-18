require("dotenv").config();
const { getSongFeaturesFromAPI } = require("../api/songfeatures");
const { getPlaylistSongs } = require("../api/playlist");
const { validateUserLogin } = require("../api/user");
const { User } = require("../database");

const getfeatures = () => {
	return User.findOne()
		.then((user) => {
			return validateUserLogin(user);
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
		.then(({ user, songList }) => getSongFeaturesFromAPI(user, songList))
		.then((response) => {
			// expect(response).toBeDefined();
			// expect(response).not.toHaveProperty("error");
			console.log("song Features: ", response);
			return response;
		});
};

// test("Get a list of song Features", getfeatures);

getfeatures();
