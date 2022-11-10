import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import NormalDistribution from "normal-distribution";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import { Playlist } from "../../API";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { average, stdDeviation } from "../../utils";

const transformFeatures = (data) => {
	return data.reduce(
		(previous, current) => {
			// previous.id.push(current.id);
			previous.danceability.push(current.danceability);
			previous.energy.push(current.energy);
			previous.key.push(current.key);
			previous.loudness.push(current.loudness);
			previous.mode.push(current.mode === 1 ? "Major" : "Minor");
			previous.speechiness.push(current.speechiness);
			previous.acousticness.push(current.acousticness);
			previous.instrumentalness.push(current.instrumentalness);
			previous.liveness.push(current.liveness);
			previous.valence.push(current.valence);
			previous.tempo.push(current.tempo);
			previous.time_signature.push(current.time_signature);

			return previous;
		},
		{
			// id: [],
			danceability: [],
			energy: [],
			key: [],
			loudness: [],
			mode: [],
			speechiness: [],
			acousticness: [],
			instrumentalness: [],
			liveness: [],
			valence: [],
			tempo: [],
			time_signature: [],
		}
	);
};

const gaussTransform = (data) => {
	const newData = {};

	for (const key in data) {
		if (Object.hasOwnProperty.call(data, key)) {
			const dataArray = data[key];
			newData[key] = {
				average: average(dataArray),
				standardDeviation: stdDeviation(dataArray),
				values: [],
			};
			const normDist = new NormalDistribution(
				newData[key].average,
				newData[key].standardDeviation
			);
			newData[key].values = dataArray.map((position) => {
				return normDist.pdf(position);
			});
		}
	}
	return newData;
};

const Statistics = ({ playlistId, hidden }) => {
	const { playlistFeatures, setPlaylistFeatures } =
		useContext(PlaylistContext);
	useEffect(() => {
		if (!playlistFeatures[playlistId]) {
			Playlist.SongFeatures(playlistId).then((response) => {
				if (response.error) return console.log(response);
				playlistFeatures[playlistId] = response;
				setPlaylistFeatures({ ...playlistFeatures });
			});
		}
	}, [playlistId, playlistFeatures, setPlaylistFeatures]);

	if (playlistId === null) {
		return null;
	}
	if (hidden) {
		return null;
	}
	if (playlistFeatures[playlistId]) {
		const features = transformFeatures(playlistFeatures[playlistId]);
		const gaussData = gaussTransform(features);

		const gaussGraphic = [];

		for (const key in gaussData) {
			const gaussCard = [];
			if (Object.hasOwnProperty.call(gaussData, key)) {
				const gaussElement = gaussData[key];
				gaussCard.push(
					<>
						<Typography variant="h5" component="div">
							Average: {gaussElement.average}
						</Typography>
						<Typography variant="h5" component="div">
							standard Deviation: {gaussElement.standardDeviation}
						</Typography>
					</>
				);
				console.info(`${key} gauss values`, gaussElement.values);
			}

			gaussGraphic.push(
				<Card sx={{ minWidth: 275 }}>
					<CardContent>
						<Typography
							sx={{ fontSize: 14 }}
							color="text.secondary"
							gutterBottom
						>
							{key}
						</Typography>
						{gaussCard.map((gaussElement) => gaussElement)}
					</CardContent>
				</Card>
			);
		}

		return (
			<div>
				{gaussGraphic.map((gaussGraphicElement) => gaussGraphicElement)}
			</div>
		);
	}
	return <CircularProgress />;
};

export default Statistics;
