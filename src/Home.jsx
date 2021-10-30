import Account from "./Account";
import Login from "./Login";

export default function Home(params) {
	const expiration = localStorage.getItem("expiration");
	const access_token = localStorage.getItem("access_token");
	if (access_token !== null && expiration > Date.now()) {
		return <Account></Account>;
	} else {
		return <Login></Login>
	}
}
