const dailyTasks = async (userList) => {
	const songsToModify = 5 + Math.floor(Math.random() * 5);
	const taskList = userList.map((user) => {
		const averageListeningTime = updateAverageTimes(user);
		const removeResponse = removeFromPlaylist(user, songsToModify);
		const addResponse = addToPlaylist(user, songsToModify);
		const removeMissingResponse = removeMissingSongs(user);
		const addMissingResponse = addMissingSongs(user);

		return averageListeningTime
			.then(removeResponse)
			.then(addResponse)
			.then(removeMissingResponse)
			.then(addMissingResponse)
			.then(() => {
				user.set({ last_modified_daily: Date.now() });
				user.save();
			});
	});
	taskList.push(
		deleteOldRemoved().then((deleteResponse) => {
			console.log("deleted all", deleteResponse);
		})
	);
	taskList.push(
		deleteUnlinkedSongs().then((deleteUnlinkedResponse) => {
			console.log("deleted unlinked", deleteUnlinkedResponse);
		})
	);
	return taskList;
};
module.exports = { dailyTasks };
