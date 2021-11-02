import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
	CircularProgress,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";

import { Inbox, Drafts } from "@mui/icons-material";

import { MePlaylist } from "./API/Me";

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = (event, index) => {
		setSelectedIndex(index);
	};

	useEffect(() => {
		const Playlists_template = (response) => {
			console.log(response.items);

			return (
				<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", }} >
					<List component="nav" aria-label="playlists">
						{
                            response.items.forEach(element => {
                                console.log(element)
                                return <ListItemButton
							selected={selectedIndex === 0}
							onClick={(event) => handleListItemClick(event, 0)}
						>
							<ListItemIcon>
								<Inbox />
							</ListItemIcon>
							<ListItemText primary="Inbox" />
						</ListItemButton>
                            })
                        }
                        

					</List>
				</Box>
			);
		};

		MePlaylist().then((response) => {
			setPlaylist(Playlists_template(response));
		});
	}, [selectedIndex]);

	return playlist;
};

export default Playlists;
