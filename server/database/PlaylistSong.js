const { DataTypes } = require("sequelize");
const PlaylistSongConfiguration = {
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
		defaultValue: Date.now(),
	},
	song_last_played: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	times_played: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
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
module.exports = { PlaylistSongConfiguration };
