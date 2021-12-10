const pushtoken = (req, res) => {
	const access_token = req.query.access_token || null;
	const refresh_token = req.query.refresh_token || null;


	req.session.access_token = access_token;
	req.session.refresh_token = refresh_token;
	req.session.save((err) =>{
		// console.log("err:",err);
		res.json({ loggedin: (req.session.access_token!==null && req.session.refresh_token!==null) });	
	});

};

module.exports = { pushtoken };
