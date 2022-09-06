const { DataTypes } = require("sequelize");
const UserSongHistoryConfiguration = {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	played_date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
};
module.exports = { UserSongHistoryConfiguration };
