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
	iduser: {
		type: DataTypes.BIGINT,
		// autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: true,
	},
};
module.exports = { PlaylistConfiguration };
