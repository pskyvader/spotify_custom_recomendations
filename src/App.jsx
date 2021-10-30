import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Callback from "./Callback";
import Header from "./Header";
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
					</Switch>
				</div>
			</Router>
		</CssBaseline>
	);
}

export default App;
