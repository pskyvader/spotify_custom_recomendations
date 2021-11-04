import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
	CircularProgress,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Grid,
	Container,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import Me, { MePlaylist } from "./API/Me";

const ItemsList = ({ items, me }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = ( index) => {
		setSelectedIndex(index);
	};

	let item_list = [];
	items.forEach((element, key) => {
		item_list.push(
			<ListItemButton
				disabled={me.id !== element.owner.id && !element.colaborative}
				key={key}
				selected={selectedIndex === key}
				onClick={() => handleListItemClick(key)}
			>
				<ListItemIcon>
					<Avatar alt={element.name} src={element.images[2].url} />
				</ListItemIcon>
				<ListItemText primary={element.name} />
			</ListItemButton>
		);
	});
	return (
		<Box>
			<List component="nav" aria-label="playlists">
				{item_list}
			</List>
		</Box>
	);
};

const Playlists_template = (response, me) => {
	return (
		<Container>
			<Grid container spacing={2}>
				<Grid item xs={4}>
					<ItemsList items={response.items} me={me} />
				</Grid>
				<Grid item xs={8}>
					<Box></Box>
				</Grid>
			</Grid>
		</Container>
	);
};

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		MePlaylist().then((response) => {
			Me().then((me) => {
				setPlaylist(Playlists_template(response, me));
			});
		});
	}, []);

	return playlist;
};

export default Playlists;
