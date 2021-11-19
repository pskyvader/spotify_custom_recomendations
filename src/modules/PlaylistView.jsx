import { ListItemButton } from "@mui/material";
import {
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	CircularProgress,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";

export const PlaylistTemplate = ({ data }) => {
    console.log(data);

    return (<ListItemButton
        disabled={me.id !== currentPlaylist.owner.id}
        key={currentPlaylist.id}
        selected={playlistId === currentPlaylist.id}
        onClick={() => {
            setPlaylistId(currentPlaylist.id);
        }}
    >
        <ListItemIcon>
            <Avatar
                alt={currentPlaylist.name}
                src={
                    currentPlaylist.images[0]
                        ? currentPlaylist.images[0].url
                        : null
                }
            />
        </ListItemIcon>
        <ListItemText primary={currentPlaylist.name} />
    </ListItemButton>)
};
