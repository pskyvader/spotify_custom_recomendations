// import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Home";
import Callback from "./Callback";

import CssBaseline from "@mui/material/CssBaseline";

function App() {
	return (
		<CssBaseline>
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
					<a
						className="App-link"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
					<Router>
						<div>
							<nav style={{ display: "none" }}>
								<ul>
									<li>
										<Link to="/">Home</Link>
									</li>
									<li>
										<Link to="/callback">Callback</Link>
									</li>
								</ul>
							</nav>
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
				</header>
			</div>
		</CssBaseline>
	);
}

export default App;
