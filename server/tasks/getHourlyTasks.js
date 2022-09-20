const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/song");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		return updateRecentSongs(user)
			.then((updateResult) => {
				if (updateResult.error) {
					console.log("Update error", updateResult);
				} else {
					console.log(`Updated`);
				}
			})
			.then(syncronizeMultiplePlaylists(user))
			.then((response) => {
				user.set({ last_modified_hourly: Date.now() });
				user.save().then(() => {
					console.log(
						"last hourly updated for user saved",
						user.name
					);
				});
				return response;
			});
	});
};

module.exports = { getHourlyTasks };
