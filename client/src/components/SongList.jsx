import React, { useState } from "react";
import { 
    Toolbar, 
    Typography, 
    Paper, 
    Box, 
    Card, 
    CardContent, 
    CardMedia, 
    Grid,
    IconButton,
    Stack,
    ListItemText,
    Avatar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import FolderIcon from "@mui/icons-material/Folder";

const renderTitle = (cellData, setCurrentSong = null) => {
    const playSong = () => {
        if (setCurrentSong !== null) {
            setCurrentSong(cellData.row);
        }
    };

    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', overflow: 'hidden' }}>
            <Avatar 
                src={cellData.row.image} 
                onClick={playSong} 
                variant="rounded"
                sx={{ cursor: "pointer", width: 50, height: 50 }}
            >
                <FolderIcon />
            </Avatar>
            <ListItemText
                primary={cellData.row.name}
                secondary={cellData.row.artist}
                primaryTypographyProps={{ noWrap: true }}
                secondaryTypographyProps={{ noWrap: true }}
                sx={{ overflow: 'hidden' }}
            />
        </Stack>
    );
};

export const SongListColumns = (
    rows,
    PlaylistId = null,
    ActionButton = null,
    setCurrentSong = null
) => {
    const renderActionButton = (params) => {
        const uri = params.formattedValue || params.row.id;
        return <ActionButton PlaylistId={PlaylistId} uri={uri} />;
    };
    const columns = [
        { 
            field: "name", 
            headerName: "Title", 
            minWidth: 250, 
            flex: 2, 
            renderCell: (params) => renderTitle(params, setCurrentSong) 
        },
        { field: "album", headerName: "Album", minWidth: 150, flex: 1 },
        { field: "duration", headerName: "Duration", width: 100, valueFormatter: (params) => {
             // Simple formatter if duration is in ms
             const minutes = Math.floor(params / 60000);
             const seconds = ((params % 60000) / 1000).toFixed(0);
             return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        }},
    ];

    if (PlaylistId !== null && ActionButton !== null) {
        columns.push({
            field: "id",
            headerName: "Action",
            minWidth: 100,
            renderCell: renderActionButton,
            sortable: false,
            filterable: false,
        });
    }

    return {
        rows,
        columns,
    };
};

const SongList = ({ data, title = "title" }) => {
    const { rows, columns } = data;
    const [viewMode, setViewMode] = useState("list");

    if (!rows || rows.length === 0) {
        return (
            <Paper sx={{ width: '100%', p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{title} - 0</Typography>
                <Typography>No songs available</Typography>
            </Paper>
        );
    }

    const actionColumn = columns.find(c => c.field === "id");

    return (
        <Paper sx={{ width: '100%', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title} - {rows.length} Songs
                </Typography>
                <IconButton 
                    onClick={() => setViewMode("list")} 
                    color={viewMode === "list" ? "primary" : "default"}
                >
                    <ViewListIcon />
                </IconButton>
                <IconButton 
                    onClick={() => setViewMode("grid")} 
                    color={viewMode === "grid" ? "primary" : "default"}
                >
                    <ViewModuleIcon />
                </IconButton>
            </Toolbar>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                {viewMode === "list" ? (
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        rowHeight={70}
                        disableRowSelectionOnClick
                        initialState={{
                            pagination: { paginationModel: { pageSize: 25 } },
                        }}
                        pageSizeOptions={[10, 25, 50, 100]}
                        sx={{ border: 0 }}
                    />
                ) : (
                    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: {
                                xs: 'repeat(2, minmax(0, 1fr))',
                                sm: 'repeat(3, minmax(0, 1fr))',
                                md: 'repeat(5, minmax(0, 1fr))',
                                lg: 'repeat(7, minmax(0, 1fr))'
                            },
                            gap: 2 
                        }}>
                            {rows.map((row) => (
                                <Card key={row.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={row.image}
                                        alt={row.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent sx={{ flex: '1 1 auto', p: 1, overflow: 'hidden' }}>
                                        <Typography variant="subtitle2" noWrap title={row.name}>
                                            {row.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap display="block" title={row.artist}>
                                            {row.artist}
                                        </Typography>
                                    </CardContent>
                                    {actionColumn && (
                                        <Box sx={{ p: 1, pt: 0, textAlign: 'center' }}>
                                            {actionColumn.renderCell({ 
                                                row, 
                                                formattedValue: row.id,
                                                value: row.id 
                                            })}
                                        </Box>
                                    )}
                                </Card>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};
export default SongList;
