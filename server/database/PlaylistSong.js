const { DataTypes } = require("sequelize");
const PlaylistSongConfiguration = {
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
