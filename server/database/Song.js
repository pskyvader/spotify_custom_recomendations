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
	image: {
		type: DataTypes.STRING(1200),
		allowNull: false,
	},
	artist: {
		type: DataTypes.STRING(1200),
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
	preview: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	duration: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	last_time_used: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: Date.now(),
	},
};
module.exports = { SongConfiguration };
