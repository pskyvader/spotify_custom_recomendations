import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Playlists from "./Playlists";
import Callback from "./Callback";
import Login from "./Login";
import Header from "../modules/Header";
import CssBaseline from "@mui/material/CssBaseline";
import PlaylistContextProvider from "../context/PlaylistContextProvider";
import ProfileContextProvider from "../context/ProfileContextProvider";
import SessionContextProvider from "../context/SessionContextProvider";

function App() {
	return (
		<CssBaseline>
			<Router>
				<SessionContextProvider>
					<ProfileContextProvider>
						<PlaylistContextProvider>
							<div>
								<Switch>
									<Route exact path="/">
										<Header>
											<Home />
										</Header>
									</Route>
									<Route exact path="/playlist/:playlistid">
										<Header>
											<Playlists />
										</Header>
									</Route>

									<Route path="/callback">
										<Callback />
									</Route>
									<Route path="/login">
										<Login />
									</Route>
								</Switch>
							</div>
						</PlaylistContextProvider>
					</ProfileContextProvider>
				</SessionContextProvider>
			</Router>
		</CssBaseline>
	);
}

export default App;
