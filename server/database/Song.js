const { DataTypes } = require("sequelize");
const SongConfiguration = {
	// Model attributes are defined here
	id: {
		type: DataTypes.STRING,
		// autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	artist: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	idartist: {
		type: DataTypes.STRING,
		// autoIncrement: true,
		allowNull: false,
	},
	album: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	action: {
		type: DataTypes.STRING,
		allowNull: false,
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
module.exports = { SongConfiguration };
