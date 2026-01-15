const { Sequelize, Model } = require("sequelize");
const { UserConfiguration } = require("./User");
const { SongConfiguration } = require("./Song");
const { SongFeaturesConfiguration } = require("./SongFeatures");
const { PlaylistSongConfiguration } = require("./PlaylistSong");
const { UserSongHistoryConfiguration } = require("./UserSongHistory");
const { PlaylistConfiguration } = require("./Playlist");
const path = require("path");

let sequelize = new Sequelize(process.env.DATABASE_URL, {
	// dialect: 'postgres',
	// protocol: 'postgres',
	// dialectOptions: {
	// 	ssl: {
	// 		// require: true,
	// 		rejectUnauthorized: false,
	// 	},
	// },
	// logging: (...msg) => console.log(msg),
	// logging: console.log,
	logging: false,
});

if (process.env.PRODUCTION === "test") {
	sequelize = new Sequelize("database", "", "", {
		dialect: "sqlite",
		logging: false,
		pool: {
			max: 5,
			min: 0,
			idle: 10000,
		},
		// Use in-memory storage for tests to avoid filesystem/permission issues in CI
		storage: ":memory:",
	});
}

class User extends Model { }
User.init(UserConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "User", // We need to choose the model name
});

class Playlist extends Model { }
Playlist.init(PlaylistConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Playlist", // We need to choose the model name
});
User.hasMany(Playlist);
Playlist.belongsTo(User);

class Song extends Model { }
Song.init(SongConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Song", // We need to choose the model name
});

class PlaylistSong extends Model { }
PlaylistSong.init(PlaylistSongConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "PlaylistSong", // We need to choose the model name
});

Playlist.belongsToMany(Song, { through: PlaylistSong });
Song.belongsToMany(Playlist, { through: PlaylistSong });

Playlist.hasMany(PlaylistSong);
PlaylistSong.belongsTo(Playlist);
Song.hasMany(PlaylistSong);
PlaylistSong.belongsTo(Song);

class UserSongHistory extends Model { }
UserSongHistory.init(UserSongHistoryConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "UserSongHistory", // We need to choose the model name
});

User.belongsToMany(Song, {
	through: { model: UserSongHistory, unique: false },
});
Song.belongsToMany(User, {
	through: { model: UserSongHistory, unique: false },
});

User.hasMany(UserSongHistory);
UserSongHistory.belongsTo(User);

Song.hasMany(UserSongHistory);
UserSongHistory.belongsTo(Song);

class SongFeatures extends Model { }
SongFeatures.init(SongFeaturesConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "SongFeatures", // We need to choose the model name
});

Song.hasOne(SongFeatures);
SongFeatures.belongsTo(Song);

const connection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		await sequelize.sync({ force: false, alter: false });
		console.log("Successfully Synced");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		// mark DB as unavailable and continue in degraded mode
		try {
			module.exports.dbAvailable = false;
		} catch (e) {
			// ignore
		}
		return false;
	}
};

module.exports = {
	sequelize,
	connection,
	// Export a flag to indicate DB availability. Default to true.
	dbAvailable: true,
	User,
	Song,
	Playlist,
	PlaylistSong,
	UserSongHistory,
	SongFeatures,
};
