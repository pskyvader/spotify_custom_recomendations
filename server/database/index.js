const { Sequelize, Model } = require("sequelize");
const { UserConfiguration } = require("./User");
const { SongConfiguration } = require("./Song");
const { PlaylistSongConfiguration } = require("./PlaylistSong");
const { UserSongHistoryConfiguration } = require("./UserSongHistory");
const { PlaylistConfiguration } = require("./Playlist");
const path = require("path");

// const sequelize = new Sequelize(process.env.DATABASE_URL+'?ssl=true' || "sqlite::memory:"); // Example for sqlite
// const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite
const sequelize = new Sequelize("database", "", "", {
	host: "0.0.0.0",
	dialect: "sqlite",
	logging: false,
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
	// Data is stored in the file `database.sqlite` in the folder `db`.
	// Note that if you leave your app public, this database file will be copied if
	// someone forks your app. So don't use it to store sensitive information.
	storage: path.resolve(__dirname, "..", "databasetest.sqlite"),
});

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
// 	// dialect: 'postgres',
// 	// protocol: 'postgres',
// 	dialectOptions: {
// 		ssl: {
// 			// require: true,
// 			rejectUnauthorized: false,
// 		},
// 	},
// 	// logging: (...msg) => console.log(msg),
// 	// logging: console.log,
// 	logging: false,
// });

class User extends Model {}
User.init(UserConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "User", // We need to choose the model name
});

class Playlist extends Model {}
Playlist.init(PlaylistConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Playlist", // We need to choose the model name
});
User.hasMany(Playlist);
Playlist.belongsTo(User);

class Song extends Model {}
Song.init(SongConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Song", // We need to choose the model name
});

class PlaylistSong extends Model {}
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

class UserSongHistory extends Model {}
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

const connection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		// sequelize.sync({ force: true});
		// sequelize.sync({ alter: true });
		sequelize.sync().then(() => console.log("Successfully Synced"));
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = {
	connection,
	User,
	Song,
	Playlist,
	PlaylistSong,
	UserSongHistory,
};
