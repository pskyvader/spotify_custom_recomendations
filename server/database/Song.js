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
	duration: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	action: {
		type: DataTypes.STRING,
		allowNull: false,
	},
};
module.exports = { SongConfiguration };
