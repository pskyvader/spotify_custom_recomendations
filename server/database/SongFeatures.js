const { DataTypes } = require("sequelize");
const SongFeaturesConfiguration = {
	// Model attributes are defined here
	id: {
		type: DataTypes.STRING,
		// autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	danceability: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	energy: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	key: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	loudness: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	mode: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	speechiness: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	acousticness: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	instrumentalness: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	liveness: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	valence: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	tempo: {
		type: DataTypes.REAL,
		defaultValue: 0,
	},
	time_signature: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
};
module.exports = { SongFeaturesConfiguration };
