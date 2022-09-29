import { useContext, useState, useEffect } from "react";
// import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
// import SkipNextIcon from "@mui/icons-material/SkipNext";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";

import { PlayerContext } from "../context/PlayerContextProvider";

const ProgressBar = ({ audioElement }) => {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const getProgress = () => {
			if (audioElement.paused) return;
			const p = parseInt(
				audioElement.currentTime * (100 / audioElement.duration)
			);
			if (p !== progress) {
				clearInterval(progressInterval);
				setProgress(p);
			}
		};
		const progressInterval = setInterval(getProgress, 500);
		return () => {
			clearInterval(progressInterval);
		};
	}, [audioElement, progress]);

	return <LinearProgress variant="determinate" value={progress} />;
};

const PlayButton = ({ audioElement }) => {
	const [isPlaying, setIsPlaying] = useState(false);
	useEffect(() => {
		audioElement.addEventListener("canplaythrough", () => {
			audioElement.play();
			setIsPlaying(true);
		});
	});

	const playTrack = () => {
		audioElement.play();
		setIsPlaying(true);
	};

	const pauseTrack = () => {
		audioElement.pause();
		setIsPlaying(false);
	};
	const playpauseTrack = () => {
		if (!isPlaying) playTrack();
		else pauseTrack();
	};
	if (!audioElement.src) {
		return "No Preview Available";
	}

	return (
		<IconButton aria-label="play/pause" onClick={playpauseTrack}>
			{isPlaying ? (
				<PauseIcon sx={{ height: 38, width: 38 }} />
			) : (
				<PlayArrowIcon sx={{ height: 38, width: 38 }} />
			)}
		</IconButton>
	);
};

const Player = () => {
	// const theme = useTheme();
	const { song } = useContext(PlayerContext);
	const [audioElement] = useState(new Audio());

	// useEffect(() => {
	// 	if (song === null) {
	// 		audioElement.src = null;
	// 		return;
	// 	}
	// 	audioElement.src = song.preview;
	// }, [audioElement, song]);

	if (song === null) {
		audioElement.src = null;
		return null;
	}
	audioElement.src = song.preview;

	return (
		// <Paper
		// 	sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
		// 	elevation={3}
		// >
		<Grid
			display="flex"
			justifyContent="center"
			alignItems="center"
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				background: "transparent",
			}}
		>
			<Stack>
				<Card xs={12} sx={{ display: "flex" }}>
					<CardMedia
						component="img"
						sx={{ width: 100 }}
						image={song.image}
						alt={song.album}
					/>
					<Box sx={{ display: "flex" }}>
						<CardContent sx={{ flex: "1 0 auto" }}>
							<Typography component="div" variant="h5">
								{song.name}
							</Typography>
							<Typography
								variant="subtitle1"
								color="text.secondary"
								component="div"
							>
								{song.artist}
							</Typography>
						</CardContent>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							p: 1,
							// pl: 1,
							// pb: 1,
						}}
					>
						{/* <IconButton aria-label="previous">
							{theme.direction === "rtl" ? (
								<SkipNextIcon />
							) : (
								<SkipPreviousIcon />
							)}
						</IconButton> */}
						{song.preview !== null ? (
							<PlayButton audioElement={audioElement} />
						) : (
							"No available Preview"
						)}

						{/* <IconButton aria-label="next">
							{theme.direction === "rtl" ? (
								<SkipPreviousIcon />
							) : (
								<SkipNextIcon />
							)}
						</IconButton> */}
					</Box>
				</Card>
				<ProgressBar
					audioElement={audioElement}
					// isPlaying={isPlaying}
				/>
			</Stack>
		</Grid>
		// </Paper>
	);
};

export default Player;
