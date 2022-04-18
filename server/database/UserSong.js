const { DataTypes } = require("sequelize");
const UserSongConfiguration = {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	song_added: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	song_last_played: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	song_removed: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	removed: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
};
module.exports = { UserSongConfiguration };
