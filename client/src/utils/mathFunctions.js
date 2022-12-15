const sum = (arr) => {
	if (arr.length === 0) return 0;
	const result = arr.reduce((a, b) => {
		if (!isNaN(b)) {
			return a + b;
		}
		return a;
	}, 0);
	return result;
};

const average = (arr) => {
	if (arr.length === 0) return 0;
	return sum(arr) / arr.length;
};

const stdDeviation = (arr, usePopulation = false) => {
	if (arr.length === 0) return 0;

	// Creating the mean with Array.reduce
	let mean = average(arr);

	// Assigning (value - mean) ^ 2 to every array item
	arr = arr.map((k) => {
		return (k - mean) ** 2;
	});
	// Calculating the sum of updated array
	const total = sum(arr);

	// Calculating the variance
	// let variance = sum / arr.length;

	// Returning the Standered deviation
	return Math.sqrt(total / (arr.length - (usePopulation ? 0 : 1)));
};

const filterOutliers = (someArray) => {
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

	return values.filter((x) => x >= minValue && x <= maxValue);
};

export { sum, average, stdDeviation, filterOutliers };
