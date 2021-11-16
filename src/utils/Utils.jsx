export const generateRandomString = (length) => {
	var text = "";
	var possible =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

export const objectToList = (main_object) => {
	if (main_object === null) return;
	return (
		<pre>
			{Object.keys(main_object).map((key, i) => {
				if (typeof main_object[key] !== "object") {
					return (
						<div key={i}>
							<span>{key} : </span>
							<span>{main_object[key].toString()}</span>
						</div>
					);
				} else {
					return (
						<div key={i}>
							<span>{key}:</span>
							<div style={{ paddingLeft: 30 }}>
								{objectToList(main_object[key])}
							</div>
						</div>
					);
				}
			})}
		</pre>
	);
};

export const subtractById = (List1, List2) => {
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
