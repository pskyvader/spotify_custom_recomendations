
const FormatSongList=(items)=>{
    const formattedList=[];
    items.forEach((element, key) => {
        const currentSong=element.track || element;
        const art = currentSong.artists.map(
            (artist) => " " + artist.name + " "
        );
        const row = {
            id: key + 1,
            name: currentSong.name,
            artist: art,
            album: currentSong.album.name,
            action: currentSong.uri,
        };
        formattedList.push(row);
    });
    return formattedList;
}

export default FormatSongList;