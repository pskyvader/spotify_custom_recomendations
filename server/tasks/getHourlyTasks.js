const { updateRecentSongs } = require("./updateRecentSongs");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		return updateRecentSongs(user.access_token, user.id)
			.then((updateResult) => {
				if (updateResult.error) {
					console.log("Update error", updateResult);
				} else {
					console.log(`Updated`);
				}
			})
			.then(() => {
				user.set({ last_modified_hourly: Date.now() });
				user.save();
			});
	});
};

module.exports = { getHourlyTasks };
