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
	image: {
		type: DataTypes.STRING(1200),
		allowNull: true,
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
	},
};
module.exports = { PlaylistConfiguration };
