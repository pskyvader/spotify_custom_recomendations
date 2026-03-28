const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeRepeatedSongs } = require("./removeRepeatedSongs");
const { log, error } = require("../utils/logger");

const getDailyTasks = (userList) => {
	const songsToModify = 1 + Math.floor(Math.random() * 4);

	log("beginning daily tasks");

	const taskList = userList.map((user) => {
		// 👇 RETURN A FUNCTION (NOT A PROMISE)
		return async () => {
			try {
				log("remove repeated songs");

				const responseRepeated = await removeRepeatedSongs(user);

				log("update times");

				const averageResponse = await updateAverageTimes(
					user,
					responseRepeated
				);

				log("remove from playlist");

				const removeResponse = await removeFromPlaylist(
					user,
					songsToModify,
					averageResponse
				);

				log("add to playlist");

				const addResponse = await addToPlaylist(
					user,
					songsToModify,
					removeResponse.removedTotal,
					removeResponse
				);

				log("save response");

				user.set({ last_modified_daily: Date.now() });

				await user.save();

				addResponse.message.push(
					`last daily updated for user ${user.name} saved`
				);

				return addResponse;
			} catch (err) {
				// you said catch is handled elsewhere, but we still need a return shape
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
