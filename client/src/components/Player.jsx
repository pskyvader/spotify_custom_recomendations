import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";

export default function Player({ song }) {
	const theme = useTheme();
	if (song === null) return null;

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
							pl: 1,
							pb: 1,
						}}
					>
						<IconButton aria-label="previous">
							{theme.direction === "rtl" ? (
								<SkipNextIcon />
							) : (
								<SkipPreviousIcon />
							)}
						</IconButton>
						<IconButton aria-label="play/pause">
							<PlayArrowIcon sx={{ height: 38, width: 38 }} />
						</IconButton>
						<IconButton aria-label="next">
							{theme.direction === "rtl" ? (
								<SkipPreviousIcon />
							) : (
								<SkipNextIcon />
							)}
						</IconButton>
					</Box>
				</Card>
				<LinearProgress variant="determinate" value={50} />
			</Stack>
		</Grid>
		// </Paper>
	);
}
