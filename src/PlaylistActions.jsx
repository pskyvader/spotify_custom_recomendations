import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

import { MeTop } from "./API/Me";
import { objectToList } from "./Utils";

const PlaylistActionsTemplate = ({ response }) => {
	return objectToList(response);
};

const PlaylistActions = ({ id }) => {
	const [playlist, setPlaylist] = useState(<CircularProgress />);

	useEffect(() => {
		if (id === null) {
			return;
		}
		MeTop().then((response) => {
			setPlaylist(<PlaylistActionsTemplate response={response} />);
		}).catch((e)=>console.log(e));
	}, [id]);

	return playlist;
};

export default PlaylistActions;
