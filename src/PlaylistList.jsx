import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";

import Avatar from "@mui/material/Avatar";

const PlaylistList = ({ items, me, SetselectedItem }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = (index) => {
		setSelectedIndex(index);
	};

	let item_list = [];
	let selectedItem = null;
	items.forEach((element, key) => {
		if (
			selectedIndex === key &&
			(me.id === element.owner.id || element.colaborative)
		) {
			selectedItem = element.id;
		}
		item_list.push(
			<ListItemButton
				disabled={me.id !== element.owner.id && !element.colaborative}
				key={key}
				selected={selectedIndex === key}
				onClick={() => {
					handleListItemClick(key);
					SetselectedItem(element.id);
				}}
			>
				<ListItemIcon>
					<Avatar alt={element.name} src={element.images[2].url} />
				</ListItemIcon>
				<ListItemText primary={element.name} />
			</ListItemButton>
		);
	});

	useEffect(() => {
		SetselectedItem(selectedItem);
	}, [SetselectedItem, selectedItem]);
	return (
		<Box>
			<List component="nav" aria-label="playlists" style={{ height: "100%"}}>
				{item_list}
			</List>
		</Box>
	);
};

export default PlaylistList;
