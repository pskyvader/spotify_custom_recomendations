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

import { CookiesProvider } from "react-cookie";

function App() {
	return (
		<CssBaseline>
			<Router>
				<CookiesProvider>
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
										<Route path="/playlist/:playlistid">
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

										<Route path="*">Not found </Route>
									</Switch>
								</div>
							</PlaylistContextProvider>
						</ProfileContextProvider>
					</SessionContextProvider>
				</CookiesProvider>
			</Router>
		</CssBaseline>
	);
}

export default App;
