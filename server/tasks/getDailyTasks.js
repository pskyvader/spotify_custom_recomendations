const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");

const { syncronizeMultiplePlaylists } = require("../api/song");

const getDailyTasks = (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		const averageListeningTime = updateAverageTimes(user);
		const SyncSongsResponse = syncronizeMultiplePlaylists(user);
		const removeResponse = removeFromPlaylist(user, songsToModify);
		// const addResponse = addToPlaylist(user, songsToModify);

		return averageListeningTime
			.then(SyncSongsResponse)
			.then(
				removeResponse.then((removeResult) => {
					console.log(removeResult.message);
					addToPlaylist(
						user,
						songsToModify,
						removeResult.removedTotal
					).then((addResult) => {
						console.log(addResult.message);
					}); // removedTotal: avoid adding too many songs to the playlist if it's already over the limit
				})
			)

			.then(() => {
				user.set({ last_modified_daily: Date.now() });
				user.save();
			});
	});
	taskList.push(deleteGarbage());
	return taskList;
};
module.exports = { getDailyTasks };
