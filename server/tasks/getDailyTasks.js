const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeRepeatedSongs } = require("./removeRepeatedSongs");

const getDailyTasks = (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		const removeRepeated = removeRepeatedSongs(user).then(
			(removeRepeatedResult) => {
				console.log("Remove Repeated:", removeRepeatedResult.message);
			}
		);
		const averageListeningTime = updateAverageTimes(user).then(
			(averageListeningTime) => {
				console.log("Average time for user:", averageListeningTime);
			}
		);
		const removeResponse = removeFromPlaylist(user, songsToModify).then(
			(removeResult) => {
				console.log("removed:", removeResult.message);
				return removeResult.removedTotal;
			}
		);
		// const addResponse = addToPlaylist(user, songsToModify);

		return removeRepeated
			.then(() => averageListeningTime)
			.then(() => removeResponse)
			.then((removedTotal) => {
				return addToPlaylist(
					user,
					songsToModify,
					removedTotal // removedTotal []: avoid adding too many songs to the playlist if it's already over the limit
				);
			})
			.then((addResult) => {
				user.set({ last_modified_daily: Date.now() });
				return user.save().then(() => {
					console.log("last daily updated for user saved", user.name);
					return addResult.message;
				});
			});
	});
	taskList.push(deleteGarbage());
	return taskList;
};
module.exports = { getDailyTasks };
