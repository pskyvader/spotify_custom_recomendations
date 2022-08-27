const { DataTypes } = require("sequelize");
const PlaylistConfiguration = {
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
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
};
module.exports = { PlaylistConfiguration };
