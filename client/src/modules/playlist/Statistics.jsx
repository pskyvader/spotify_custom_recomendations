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
	LineSeries,
	ArgumentAxis,
	ValueAxis,
	Legend,
	Tooltip,
	ZoomAndPan,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation, EventTracker, Palette } from "@devexpress/dx-react-chart";

import { Playlist } from "../../API";
import { PlaylistContext } from "../../context/PlaylistContextProvider";
import { average, stdDeviation, filterOutliers } from "../../utils";

const transformFeatures = (data) => {
	return data.reduce(
		(previous, current) => {
			// previous.id.push(current.id);
			previous.danceability.push(current.danceability);
			previous.energy.push(current.energy);
			previous.key.push(current.key);
			previous.loudness.push(current.loudness);
			previous.mode.push(current.mode); // === 1 ? "Major" : "Minor");
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
			const tmpArray = [...data[key].filter((item) => !isNaN(item))];
			const dataArray = filterOutliers(tmpArray);
			newData[key] = {
				average: average(dataArray),
				standardDeviation: stdDeviation(dataArray),
				values: [],
			};
			const normDist = new NormalDistribution(
				newData[key].average,
				newData[key].standardDeviation
			);
			// dataArray.push(0, 1);
			newData[key].values = dataArray
				.map((position) => {
					return {
						x: normDist.pdf(position),
						y: position,
					};
				})
				.sort((a, b) => {
					return a.y - b.y;
				});
		}
	}
	return newData;
};

const GaussMultipleDistributionChart = ({ data, playlistId }) => {
	const proccessedData = data.reduce((previous, d) => {
		if (d.info.average === 0) {
			return previous;
		}
		const values = d.info.values.map((value) => {
			const newValue = {};
			newValue[`x_${d.key}`] = value.x;
			newValue[`y`] = value.y;
			return newValue;
		});
		return previous.concat(values);
	}, []);

	return (
		<Card sx={{ minWidth: 275 }} key={playlistId + "GaussMultipleChart"}>
			<CardContent>
				<Paper>
					<Chart data={proccessedData}>
						<Palette
							scheme={[
								"#42A5F5",
								"#FF7043",
								"#9CCC65",
								"#FFCA28",
								"#26A69A",
								"#EC407A",
								"#4F378B",
							]}
						/>
						<ArgumentAxis showGrid />
						<ValueAxis />
						{data.map((d) => {
							return (
								<LineSeries
									key={d.key}
									valueField={`x_${d.key}`}
									// argumentField={`y_${d.key}`}
									argumentField={`y`}
									name={d.key}
								/>
							);
						})}

						<Animation />
						<Legend />
						<EventTracker />
						<Tooltip />
						<ZoomAndPan />
					</Chart>
				</Paper>
			</CardContent>
		</Card>
	);
};

const GaussDistributionChart = ({ data, title }) => {
	return (
		<Paper key={"data" + title}>
			<Chart data={data}>
				<ArgumentAxis showGrid />
				<ValueAxis />
				{/* <ScatterSeries valueField="x" argumentField="y" name={title} /> */}
				<LineSeries valueField="x" argumentField="y" name={title} />
				<Animation />
				<Legend />
				<EventTracker />
				<Tooltip />
			</Chart>
		</Paper>
	);
};

const Statistics = ({ playlistId, hidden }) => {
	const validGauss = [
		"danceability",
		"energy",
		"speechiness",
		"acousticness",
		"instrumentalness",
		"liveness",
		"valence",
	];
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
		const validGaussGraphic = [];

		for (const key in gaussData) {
			if (Object.hasOwnProperty.call(gaussData, key)) {
				const gaussElement = { info: gaussData[key], key: key };
				if (!validGauss.includes(key)) {
					gaussGraphic.push(gaussElement);
				} else {
					validGaussGraphic.push(gaussElement);
				}
			}
		}
		return (
			<>
				<GaussMultipleDistributionChart
					data={validGaussGraphic}
					playlistId={playlistId}
				/>

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
									{info.average !== 0 && (
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
			</>
		);
	}
	return <CircularProgress />;
};

export default Statistics;
