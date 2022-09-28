const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeRepeatedSongs } = require("./removeRepeatedSongs");

const getDailyTasks = (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		return removeRepeatedSongs(user)
			.then((responseRepeated) =>
				updateAverageTimes(user, responseRepeated)
			)
			.then((averageResponse) =>
				removeFromPlaylist(user, songsToModify, averageResponse)
			)
			.then((removeResponse) => {
				return addToPlaylist(
					user,
					songsToModify,
					removeResponse.removedTotal, // removedTotal []: avoid adding too many songs to the playlist if it's already over the limit
					removeResponse
				);
			})
			.then((addResponse) => {
				user.set({ last_modified_daily: Date.now() });
				return user.save().then(() => {
					addResponse.message.push(
						`last daily updated for user ${user.name} saved`
					);
					return addResponse;
				});
			});
	});
	if (userList.length > 0) {
		taskList.push(deleteGarbage());
	}
	return taskList;
};
module.exports = { getDailyTasks };
