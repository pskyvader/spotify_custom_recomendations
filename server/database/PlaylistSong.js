const { DataTypes } = require("sequelize");
const PlaylistSongConfiguration = {
	id: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	add_date: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: Date.now(),
	},
	removed_date: {
		type: DataTypes.DATE,
		allowNull: true,
	},
	active: {
		type: DataTypes.BOOLEAN,
		allowNull: false,
		defaultValue: false,
	},
};
module.exports = { PlaylistSongConfiguration };
