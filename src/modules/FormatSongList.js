export const FormatSongList = (items) => {
	const formattedList = [];
	items.forEach((element) => {
		const currentSong = element.track || element;
		const art = currentSong.artists.map(
			(artist) => " " + artist.name + " "
		);
		const row = {
			id: currentSong.id,
			name: currentSong.name,
			artist: art,
			album: currentSong.album.name,
			action: currentSong.uri,
		};
		formattedList.push(row);
	});

	return formattedList;
};


export const FormatSongListColumns = (songList) => {
	const rows = songList;
	const columns = [
		{ field: "id", headerName: "#", minWidth: 40, flex: 0.1 },
		{ field: "name", headerName: "Title", flex: 1 },
		{ field: "artist", headerName: "Artist", flex: 1 },
		{ field: "album", headerName: "Album", flex: 1 },
		{
			field: "action",
			headerName: "",
			minWidth: 120,
			flex: 1,
			renderCell: (cellData) => {
				// return buttonAction(cellData);
				return "uwu";
			},
		},
	];
	const data = {
		rows,
		columns,
	};
	return data;

}
