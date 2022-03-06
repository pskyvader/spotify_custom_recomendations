const { Sequelize, Model } = require("sequelize");
const { UserConfiguration } = require("./User");
const { SongConfiguration } = require("./Song");
const { PlaylistConfiguration } = require("./Playlist");

// const sequelize = new Sequelize(process.env.DATABASE_URL+'?ssl=true' || "sqlite::memory:"); // Example for sqlite
// const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	// dialect: 'postgres',
	// protocol: 'postgres',
	dialectOptions: {
		ssl: {
			// require: true,
			rejectUnauthorized: false,
		},
	},
	// logging: (...msg) => console.log(msg),
	// logging: console.log,
	logging: false,
});

class User extends Model {}
User.init(UserConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "User", // We need to choose the model name
});

class Song extends Model {}
Song.init(SongConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Song", // We need to choose the model name
});

class Playlist extends Model {}
Playlist.init(PlaylistConfiguration, {
	// Other model options go here
	sequelize, // We need to pass the connection instance
	// modelName: "Playlist", // We need to choose the model name
});

const connection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		// sequelize.sync({ force: true });
		// sequelize.sync({ alter: true });
		// sequelize.sync();
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = { connection, User, Song, Playlist };
