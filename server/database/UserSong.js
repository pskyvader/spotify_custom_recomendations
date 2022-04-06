const { DataTypes } = require("sequelize");
const UserSongConfiguration = {
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
