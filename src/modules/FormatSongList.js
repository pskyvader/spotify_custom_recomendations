
const FormatSongList=(items)=>{
    console.log(items)
    const formattedList=[];
    items.forEach((element, key) => {
        const art = element.track.artists.map(
            (artist) => " " + artist.name + " "
        );
        const row = {
            id: key + 1,
            name: element.track.name,
            artist: art,
            album: element.track.album.name,
            action: element.track.uri,
        };
        formattedList.push(row);
    });
    return formattedList;
}

export default FormatSongList;