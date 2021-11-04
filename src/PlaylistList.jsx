const PlaylistList = ({ items, me }) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleListItemClick = ( index) => {
		setSelectedIndex(index);
	};

	let item_list = [];
	items.forEach((element, key) => {
		item_list.push(
			<ListItemButton
				disabled={me.id !== element.owner.id && !element.colaborative}
				key={key}
				selected={selectedIndex === key}
				onClick={() => handleListItemClick(key)}
			>
				<ListItemIcon>
					<Avatar alt={element.name} src={element.images[2].url} />
				</ListItemIcon>
				<ListItemText primary={element.name} />
			</ListItemButton>
		);
	});
	return (
		<Box>
			<List component="nav" aria-label="playlists">
				{item_list}
			</List>
		</Box>
	);
};

export default PlaylistList;