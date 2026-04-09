const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/playlist");

const { log, info, error } = require("../utils/logger");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		// 👇 return a function (deferred execution)
		return async () => {
			try {
				log("update recent songs", { userId: user.id });

				const updateResponse = await updateRecentSongs(user);

				log("synchronize playlists", { userId: user.id });

				const syncResponse = await syncronizeMultiplePlaylists(user);

				user.set({ last_modified_hourly: Date.now() });

				await user.save();

				info("hourly tasks completed for user", {
					userId: user.id,
					userName: user.name,
					updateError: updateResponse.error,
					syncError: syncResponse.error,
				});

				return {
					error: updateResponse.error || syncResponse.error,
					addedCount: updateResponse.addedCount || 0,
					failedCount: updateResponse.failedCount || 0,
				};
			} catch (err) {
				// keep consistent with your system contract
				error("Hourly task failed", {
					userId: user.id,
					error: err?.message,
				});

				return { error: true };
			}
		};
	});
};

module.exports = { getHourlyTasks };
