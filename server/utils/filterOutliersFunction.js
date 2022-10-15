function filterOutliers(someArray) {
	if (someArray.length < 4) return someArray;

	let values, q1, q3, iqr, maxValue, minValue;

	values = someArray.slice().sort((a, b) => a - b); //copy array fast and sort
	const len = values.length / 4;

	if (len % 1 === 0) {
		//find quartiles
		q1 = (1 / 2) * (values[len] + values[len + 1]);
		q3 = (1 / 2) * (values[len * 3 - 1] + values[len * 3]);
	} else {
		q1 = values[Math.floor(len + 1)];
		q3 = values[Math.ceil(len * 3)];
	}

	iqr = q3 - q1;
	maxValue = q3 + iqr * 1.5;
	minValue = q1 - iqr * 1.5;

	const finalresponse = values.filter((x) => x >= minValue && x <= maxValue);
	// console.log(
	// 	someArray.length,
	// 	finalresponse.length,
	// 	"numbers",
	// 	minValue,
	// 	maxValue,
	// 	q1,
	// 	q3,
	// 	iqr
	// );
	return finalresponse;
}

module.exports = { filterOutliers };
