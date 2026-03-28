const { updateRecentSongs } = require("./updateRecentSongs");
const { syncronizeMultiplePlaylists } = require("../api/playlist");

const { log, error } = require("../utils/logger");

const getHourlyTasks = (userList) => {
	return userList.map((user) => {
		// 👇 return a function (deferred execution)
		return async () => {
			try {
				log("update recent songs", { userId: user.id });

				const updateResponse = await updateRecentSongs(user);

				log("synchronize playlists", { userId: user.id });

				const syncResponse = await syncronizeMultiplePlaylists(user);

				const response = {
					error: updateResponse.error || syncResponse.error,
					message: [
						updateResponse.message,
						...syncResponse.message,
					],
				};

				user.set({ last_modified_hourly: Date.now() });

				await user.save();

				response.message.push(
					`last hourly updated for user ${user.name} saved`
				);

				return response;
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
