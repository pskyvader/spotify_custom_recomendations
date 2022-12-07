const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/song");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		return updateRecentSongs(user)
			.then((updateResult) => {
				return syncronizeMultiplePlaylists(user).then((syncResult) => {
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
