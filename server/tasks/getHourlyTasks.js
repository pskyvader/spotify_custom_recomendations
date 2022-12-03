const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/song");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		return updateRecentSongs(user)
			.then((updateResult) => {
				if (updateResult.error) {
					console.log("updateRecentSongs error", updateResult.error);
				}
				return syncronizeMultiplePlaylists(user).then((syncResult) => {
					if (syncResult.error) {
						console.log(
							"syncronizeMultiplePlaylists error",
							syncResult.error
						);
					}
					return {
						error: updateResult.error || syncResult.error,
						message: [updateResult.message, ...syncResult.message],
					};
				});
			})
			.then((response) => {
				user.set({ last_modified_hourly: Date.now() });
				return user.save().then(() => {
					response.message.push(
						`last hourly updated for user ${user.name} saved`
					);
					return response;
				});
			});
	});
};

module.exports = { getHourlyTasks };
