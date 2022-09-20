const { fn, col, Op } = require("sequelize");

const week = 604800000;
const updateAverageTimes = async (user) => {
	let date_format = fn("to_char", col("played_date"), "YYYY/MM/DD");
	if (process.env.PRODUCTION === "test") {
		date_format = fn("strftime", "%Y-%m-%d", col("played_date"));
	}
	const userSongs = await user
		.getUserSongHistories({
			attributes: [
				[fn("count", col("id")), "total"],
				[date_format, "played"],
			],
			where: {
				played_date: {
					[Op.gte]: Date.now() - 4 * week,
				},
			},
			order: [[date_format, "DESC"]],
			group: [date_format],
		})
		.catch((err) => {
			return { error: err.message };
		});

	const response = { dates: 0, total_times: 0 };
	for (const date of userSongs) {
		// console.log(date.getDataValue("total"), date.getDataValue("played"));
		response.dates += 1;
		response.total_times += parseInt(date.getDataValue("total"));
	}
	// console.log(response);

	response.average =
		response.dates > 0 ? response.total_times / response.dates : 0;

	return response;
};

module.exports = { updateAverageTimes };
