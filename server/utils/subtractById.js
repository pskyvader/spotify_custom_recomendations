const subtractById = (List1, List2) => {
	const finalR = [];
	List1.forEach((element1) => {
		const id = element1.id;
		const found =
			List2.find((element2) => {
				return element2.id === id;
			}) || null;

		if (found === null) finalR.push(element1);
	});
	return finalR;
};

module.exports = { subtractById };
