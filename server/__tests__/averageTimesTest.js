require("dotenv").config();
const { updateAverageTimes } = require("../tasks");
const { User } = require("../database");

const averageTimesTest = () => {
	User.findOne()
		.then((user) => updateAverageTimes(user))
		.then((response) => {
			console.log(response);
		});
};

if (require.main === module) {
	averageTimesTest();
}
