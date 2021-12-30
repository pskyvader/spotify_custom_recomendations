const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.DATABASE_URL+'?ssl=true' || "sqlite::memory:"); // Example for sqlite
// const sequelize = new Sequelize("sqlite::memory:"); // Example for sqlite

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    // dialect: 'postgres',
    // protocol: 'postgres',
    dialectOptions: {
        ssl: {
            // require: true,
            rejectUnauthorized: false
        }
    }
});


const connection = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = { connection };
