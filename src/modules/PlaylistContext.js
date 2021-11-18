import { createContext } from "react";

const PlaylistContext = createContext({
    playlistId: null,
    setPlaylistId: () => {},
  });
export default PlaylistContext;
