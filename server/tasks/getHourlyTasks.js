const { updateRecentSongs } = require("./updateRecentSongs");

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
			.then(() => {
				user.set({ last_modified_hourly: Date.now() });
				user.save().then(() => {
					console.log("last hourly updated for user saved", user.name);
				});
			});
	});
};

module.exports = { getHourlyTasks };
