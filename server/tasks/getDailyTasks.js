const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeRepeatedSongs } = require("./removeRepeatedSongs");
const { log, info, error } = require("../utils/logger");

const getDailyTasks = (userList) => {
	const songsToModify = 1 + Math.floor(Math.random() * 4);

	log("beginning daily tasks", { userCount: userList.length });

	const taskList = userList.map((user) => {
		// 👇 RETURN A FUNCTION (NOT A PROMISE)
		return async () => {
			try {
				log("remove repeated songs", { userId: user.id });

				const responseRepeated = await removeRepeatedSongs(user);

				log("update times", { userId: user.id });

				const averageResponse = await updateAverageTimes(
					user,
					responseRepeated
				);

				log("remove from playlist", { userId: user.id });

				const removeResponse = await removeFromPlaylist(
					user,
					songsToModify,
					averageResponse
				);

				log("add to playlist", { userId: user.id });

				const addResponse = await addToPlaylist(
					user,
					songsToModify,
					removeResponse.removedTotal,
					removeResponse
				);

				log("save response", { userId: user.id });

				user.set({ last_modified_daily: Date.now() });

				await user.save();

				info("daily tasks completed for user", {
					userId: user.id,
					userName: user.name,
					removedTotal: removeResponse.removedTotal,
					addedTotal: addResponse.addedTotal,
				});

				return {
					error: addResponse.error || removeResponse.error,
					removedTotal: removeResponse.removedTotal,
					addedTotal: addResponse.addedTotal,
				};
			} catch (err) {
				error("Daily task failed", {
					userId: user.id,
					error: err?.message,
				});

				return { error: true };
			}
		};
	});

	if (userList.length > 0) {
		taskList.push(async () => {
			log("delete garbage");
			return await deleteGarbage();
		});
	}

	return taskList;
};

module.exports = { getDailyTasks };
