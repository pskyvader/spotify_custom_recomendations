const { Op } = require("sequelize");
const { Song } = require("../../database");

const { log } = require("../../utils/logger");

/**
 * Fetches recently played songs for a specific user.
 * @param {Object} user - The Sequelize user instance.
 * @param {Date|Number} date - Starting point for the query (defaults to 0/Epoch).
 * @param {Number|String} limit - Maximum number of records to return.
 */
const getRecentlyPlayedSongs = async (user, date = 0, limit = null) => {
	const options = {
		where: {
			played_date: { [Op.gte]: date },
		},
		order: [["played_date", "DESC"]],
		include: [Song],
		// subQuery: false ensures the limit applies to the main record count
		// when using associations like 'Song'.
		subQuery: false,
	};

	// Convert limit to a number and verify it's a positive value
	const parsedLimit = parseInt(limit);
	if (!isNaN(parsedLimit) && parsedLimit > 0) {
		options.limit = parsedLimit;
	}

	log("date:", date, "limit:", limit);
	log(`Fetching recently played songs for user ID ${user.id} with options:`, options);


	return user
		.getUserSongHistories(options)
		.catch((err) => {
			return { error: true, message: err.message };
		});
};

module.exports = { getRecentlyPlayedSongs };
