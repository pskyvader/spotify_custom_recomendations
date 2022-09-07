const {
	updateAverageTimes,
	removeFromPlaylist,
	addToPlaylist,
	deleteGarbage,
} = require(".");
const { syncronizeMultiplePlaylists } = require("../api/song");

const getDailyTasks = async (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		const averageListeningTime = updateAverageTimes(user);
		const SyncSongsResponse = syncronizeMultiplePlaylists(user);
		const removeResponse = removeFromPlaylist(user, songsToModify);
		const addResponse = addToPlaylist(user, songsToModify);

		return averageListeningTime
			.then(SyncSongsResponse)
			.then(removeResponse)
			.then(addResponse)
			.then(() => {
				user.set({ last_modified_daily: Date.now() });
				user.save();
			});
	});
	taskList.push(deleteGarbage());
	return taskList;
};
module.exports = { getDailyTasks };
