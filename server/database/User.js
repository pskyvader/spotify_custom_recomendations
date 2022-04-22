const { DataTypes } = require("sequelize");
const UserConfiguration = {
	// Model attributes are defined here
	id: {
		type: DataTypes.BIGINT,
		// autoIncrement: true,
		allowNull: false,
		primaryKey: true,
		unique: true,
	},
	hash: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	url: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	image: {
		type: DataTypes.STRING(1200),
		allowNull: false,
	},
	access_token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	refresh_token: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	expiration: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	last_modified: {
		type: DataTypes.DATE,
		allowNull: false,
		defaultValue: Date.now() - 1000 * 60 * 60 * 24,
	},
};

module.exports = { UserConfiguration };
