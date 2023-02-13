const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/playlist");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		return updateRecentSongs(user)
			.then((updateResponse) => {
				return syncronizeMultiplePlaylists(user).then(
					(syncResponse) => {
						return {
							error: updateResponse.error || syncResponse.error,
							message: [
								updateResponse.message,
								...syncResponse.message,
							],
						};
					}
				);
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
