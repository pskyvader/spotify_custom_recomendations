import { useContext, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import NormalDistribution from "normal-distribution";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import Paper from "@mui/material/Paper";
import {
	Chart,
	ScatterSeries,
	ArgumentAxis,
	ValueAxis,
	Legend,
	Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker } from "@devexpress/dx-react-chart";

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
			const dataArray = [...data[key]];
			newData[key] = {
				average: average(dataArray),
				standardDeviation: stdDeviation(dataArray),
				values: [],
			};
			const normDist = new NormalDistribution(
				newData[key].average,
				newData[key].standardDeviation
			);
			dataArray.push(0, 1);
			newData[key].values = dataArray
				.filter((value) => !isNaN(value))
				.map((position) => {
					return {
						x: normDist.pdf(position),
						y: position,
					};
				});
		}
	}
	return newData;
};

const GaussDistributionChart = ({ data, title }) => {
	return (
		<Paper key={"data" + title}>
			<Chart data={data}>
				<ArgumentAxis showGrid />
				<ValueAxis />
				<ScatterSeries valueField="x" argumentField="y" name={title} />
				{/* <ScatterSeries valueField="val2" argumentField="arg2" />  */}
				<Animation />
				<Legend />
				<EventTracker />
				<Tooltip />
			</Chart>
		</Paper>
	);
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
			if (Object.hasOwnProperty.call(gaussData, key)) {
				const gaussElement = { info: gaussData[key], key: key };
				gaussGraphic.push(gaussElement);
			}
		}
		return (
			<div>
				{gaussGraphic.map((gaussElement) => {
					const { info, key } = gaussElement;
					return (
						<Card sx={{ minWidth: 275 }} key={key}>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color="text.secondary"
									gutterBottom
								>
									{key}
								</Typography>
								<div key={"div" + key}>
									<Typography variant="h5" component="div">
										Average: {info.average}
									</Typography>
									<Typography variant="h5" component="div">
										standard Deviation:{" "}
										{info.standardDeviation}
									</Typography>
									{!isNaN(info.average) && (
										<GaussDistributionChart
											key={"chart" + key}
											data={info.values}
											title={key}
										/>
									)}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		);
	}
	return <CircularProgress />;
};

export default Statistics;
