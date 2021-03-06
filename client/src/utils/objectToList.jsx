const objectToList = (main_object) => {
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

export default objectToList;
