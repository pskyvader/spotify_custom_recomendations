const { updateAverageTimes } = require("./updateAverageTimes");
const { removeFromPlaylist } = require("./removeFromPlaylist");
const { addToPlaylist } = require("./addToPlaylist");
const { deleteGarbage } = require("./deleteGarbage");
const { removeRepeatedSongs } = require("./removeRepeatedSongs");
const { log, error,log } = require("../utils/logger");


const getDailyTasks = (userList) => {
	const songsToModify = 1 + Math.floor(Math.random() * 4);
	log("beginning daily tasks");
	const taskList = userList.map((user) => {
		log("remove repeated songs");
		return removeRepeatedSongs(user)
			.then((responseRepeated) =>{
				log("update times");
				return updateAverageTimes(user, responseRepeated);
			}
			)
			.then((averageResponse) =>{
				log("remove from playlist");
				return removeFromPlaylist(user, songsToModify, averageResponse);
			}
			)
			.then((removeResponse) => {
				log ("add to playlist");
				return addToPlaylist(
					user,
					songsToModify,
					removeResponse.removedTotal, // removedTotal []: avoid adding too many songs to the playlist if it's already over the limit
					removeResponse
				);
			})
			.then((addResponse) => {
				log("save reaponse");
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
		log("delete garbage");
		taskList.push(deleteGarbage());
	}
	return taskList;
};
module.exports = { getDailyTasks };
