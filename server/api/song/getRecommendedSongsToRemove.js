const { Op } = require("sequelize");
const { UserSongHistory, PlaylistSong } = require("../../database");

//week in ms
const week = 604800000;

const getRecommendedSongsToRemove = async (playlist) => {
	const oldAddedSongs = await playlist
		.getSongs({
			include: [
				UserSongHistory,
				{
					model: PlaylistSong,
					where: {
						active: true,
						add_date: {
							[Op.lte]: Date.now() - 1 * week,
						},
					},
				},
			],
			order: [
				[UserSongHistory, "played_date", "DESC"],
				[PlaylistSong, "add_date", "ASC"],
			],
		})
		.catch((err) => {
			return { error: err.message };
		});

	//never played songs
	const recommendedForRemove = oldAddedSongs.filter((song) => {
		return song.UserSongHistories.length === 0;
	});

	//never played + old played songs (over two weeks ago)
	if (recommendedForRemove.length < 15) {
		recommendedForRemove.push(
			...oldAddedSongs.filter((song) => {
				if (song.UserSongHistories.length === 0) {
					return false;
				}
				return (
					song.UserSongHistories[0].played_date <
					Date.now() - 2 * week
				);
			})
		);
	}

	console.log(
		"recommended for remove",
		recommendedForRemove.length,
		recommendedForRemove.map((song) => {
			const result = {
				name: song.name,
				length: recommendedForRemove.length,
				last_played:
					song.UserSongHistories.length > 0
						? new Date(
								song.UserSongHistories[0].played_date
						  ).toLocaleString()
						: "Never",
				added: new Date(song.PlaylistSong.add_date).toLocaleString(),
			}.join(",");
			return JSON.stringify(result);
		})
	);

	return recommendedForRemove.slice(0, 15);
};

module.exports = {
	getRecommendedSongsToRemove,
};
