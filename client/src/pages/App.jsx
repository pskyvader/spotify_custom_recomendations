import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
									<Routes>
										<Route
											exact
											path="/"
											element={
												<Header>
													<Home />
												</Header>
											}
										></Route>
										<Route
											path="/playlist/:playlistid"
											element={
												<Header>
													<Playlists />
												</Header>
											}
										></Route>
										<Route
											path="/callback"
											element={<Callback />}
										></Route>
										<Route
											path="/login"
											element={<Login />}
										></Route>

										<Route
											path="*"
											element={<div>Not found </div>}
										></Route>
									</Routes>
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
