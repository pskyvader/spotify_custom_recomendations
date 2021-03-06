const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const stateKey = process.env.STATEKEY;
const redirect_uri =
	process.env.PRODUCTION == "production"
		? process.env.REDIRECT_URI_PRODUCTION
		: process.env.REDIRECT_URI; // Your redirect uri

const credentials = {
	client_id,
	client_secret,
	redirect_uri,
	stateKey,
};

module.exports = { credentials };
