const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");

const getDailyTasks = (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		const averageListeningTime = updateAverageTimes(user).then(
			(averageListeningTime) => {
				console.log("Average time for user:", averageListeningTime);
			}
		);
		const removeResponse = removeFromPlaylist(user, songsToModify);
		// const addResponse = addToPlaylist(user, songsToModify);

		return averageListeningTime
			.then(removeResponse)
			.then((removeResult) => {
				console.log(removeResult.message);
				return addToPlaylist(
					user,
					songsToModify,
					removeResult.removedTotal // removedTotal: avoid adding too many songs to the playlist if it's already over the limit
				);
			})
			.then((addResult) => {
				console.log(addResult.message);
			})
			.then(() => {
				user.set({ last_modified_daily: Date.now() });
				user.save().then(() => {
					console.log("last daily updated for user saved", user.name);
				});
			});
	});
	taskList.push(deleteGarbage());
	return taskList;
};
module.exports = { getDailyTasks };
