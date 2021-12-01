// import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./home/Home";
import Callback from "./Callback";
import Login from "./Login";
import Header from "./home/Header";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
	return (
		<CssBaseline>
			<Router>
				<div>
					<Switch>
						<Route exact path="/">
							<Header></Header>
							<Home />
						</Route>
						<Route path="/callback">
							<Callback />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
					</Switch>
				</div>
			</Router>
		</CssBaseline>
	);
}

export default App;
