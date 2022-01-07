const { Sequelize, DataTypes, Model } = require("sequelize");

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
    logging: console.log,
	// logging: false,
});

class User extends Model {
	getFullname() {
		return [this.firstname, this.lastname].join(" ");
	}
}
User.init(
	{
		// Model attributes are defined here
		id: {
			type: DataTypes.INTEGER,
			// autoIncrement: true,
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING,
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
	},
	{
		// Other model options go here
		sequelize, // We need to pass the connection instance
		modelName: "User", // We need to choose the model name
	}
);

const connection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		sequelize.sync({ alter: true });
		// sequelize.sync();
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = { connection,User };
