import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Callback from "./Callback";
import Header from "./Header";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
	return (
		<CssBaseline>
			<Header></Header>
			<body>
				<Router>
					<div>
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route path="/callback">
								<Callback />
							</Route>
						</Switch>
					</div>
				</Router>
			</body>
		</CssBaseline>
	);
}

export default App;
