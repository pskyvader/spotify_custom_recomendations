import { useContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

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
	const { song } = useContext(PlayerContext);
	const [audioElement] = useState(new Audio());
	useEffect(() => {
		audioElement.src = song !== null && song.preview;
		return () => {
			audioElement.src = null;
		};
	}, [audioElement, song]);

	if (song === null) {
		return null;
	}

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
				position: { xs: "sticky", md: "fixed" },
				bottom: 0,
				left: 0,
				right: 0,
				width: { xs: "auto", md: "max-content" },
				maxWidth: { xs: "none", md: "50vw" },
				margin: "auto",
			}}
		>
			<Stack sx={{ width: "100%" }}>
				<Card sx={{ display: "flex" }}>
					<CardMedia
						component="img"
						sx={{ width: 100 }}
						image={song.image}
						alt={song.album}
					/>
					<Box
						sx={{
							display: "flex",
							overflow: "hidden",
							maxHeight: 100,
						}}
					>
						<CardContent
							sx={{
								flex: "1 0 auto",
								maxWidth: "100%",
								overflow: "auto",
							}}
						>
							<Typography
								component="div"
								variant="h5"
								// noWrap
								sx={{
									fontSize: {
										xs: "1.0rem",
										sm: "1.25rem",
										md: "1.5rem",
									},
								}}
							>
								{song.name}
							</Typography>
							<Typography
								variant="subtitle1"
								color="text.secondary"
								component="div"
								// noWrap
								sx={{
									fontSize: {
										xs: "0.75rem",
										sm: "0.875rem",
										md: "1.0rem",
									},
								}}
							>
								{song.artist}
							</Typography>
						</CardContent>
					</Box>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							flex: 1,
							flexDirection: "row-reverse",
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
							<ErrorOutlineIcon sx={{ height: 38, width: 38 }} />
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
				<ProgressBar audioElement={audioElement} />
			</Stack>
		</Grid>
		// </Paper>
	);
};

export default Player;
