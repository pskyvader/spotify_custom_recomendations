const sum = (arr) => {
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

export { sum, average, stdDeviation };
