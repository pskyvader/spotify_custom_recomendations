const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri
const stateKey = process.env.STATEKEY;

const credentials = {
	client_id,
	client_secret,
	redirect_uri,
	stateKey,
};

module.exports = {credentials};