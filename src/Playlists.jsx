import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import {
	CircularProgress,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

import Me, { MePlaylist } from "./API/Me";

const Playlists = () => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	const ItemsList = ({ items,me }) => {
		const [selectedIndex, setSelectedIndex] = useState(0);

		const handleListItemClick = (event, index) => {
			setSelectedIndex(index);
		};

		let item_list = [];
		items.forEach((element, key) => {
            console.log(element);
            if(me.id===element.owner.id){
                
			item_list.push(
				<ListItemButton
					key={key}
					selected={selectedIndex === key}
					onClick={(event) => handleListItemClick(event, key)}
				>
					<ListItemIcon>
						<Avatar
							alt={element.name}
							src={element.images[2].url}
						/>
					</ListItemIcon>
					<ListItemText primary={element.name} />
				</ListItemButton>
			);
        }
		});
		return item_list;
	};

	const Playlists_template = (response,me) => {
		return (
			<Box
				sx={{
					width: "100%",
					maxWidth: 360,
					bgcolor: "background.paper",
				}}
			>
				<List component="nav" aria-label="playlists">
					<ItemsList items={response.items} me={me}/>
				</List>
			</Box>
		);
	};

	useEffect(() => {
		MePlaylist().then((response) => {
            Me().then((me) => {
                setPlaylist(Playlists_template(response,me));
            });
			
		});
	}, []);

	return playlist;
};

export default Playlists;
