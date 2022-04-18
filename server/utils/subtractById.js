const subtractById = (List1, List2) => {
	return List1.filter((currentElement) => {
		return !List2.find((element2) => {
			return element2.id === currentElement.id;
		});
	});
};

module.exports = { subtractById };
