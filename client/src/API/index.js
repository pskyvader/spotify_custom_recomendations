const client_id = process.env.REACT_APP_CLIENT_ID; // Your client id
const client_secret = process.env.REACT_APP_CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REACT_APP_REDIRECT_URI; // Your redirect uri
const stateKey = process.env.REACT_APP_STATEKEY;

export const Credentials = {
	client_id,
	client_secret,
	redirect_uri,
	stateKey,
};

export * as Me from "./Me";
export * as Playlist from "./Playlist";
export * as Recommended from "./Recommended";
