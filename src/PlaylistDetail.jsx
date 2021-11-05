import * as React from "react";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

import { objectToList } from "./Utils";

import Me from "./API/Me";
import Playlist from "./API/Playlist";

const PlaylistTemplate = ({ response,me }) => {
	return (
		<Box>
            {objectToList(response.tracks)}
			<Card sx={{ maxWidth: 345 }}>
				<CardMedia
					component="img"
					height="140"
					image="/static/images/cards/contemplative-reptile.jpg"
					alt="green iguana"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						Lizard
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Lizards are a widespread group of squamate reptiles,
						with over 6,000 species, ranging across all continents
						except Antarctica
					</Typography>
				</CardContent>
				<CardActions>
					<Button size="small">Share</Button>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		</Box>
	);
};

const PlaylistDetail = ({id}) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
        if(id===null){
            return;
        }
		Playlist(id).then((response) => {
			Me().then((me) => {
                if(response.error){
                    setPlaylist(objectToList(response));
                }else{
                    setPlaylist(<PlaylistTemplate response={response} me={me} />);
                }
				
			});
		});
	}, [id]);

	return playlist;
};

export default PlaylistDetail;
