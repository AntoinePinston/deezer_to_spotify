function request_deezer(link) {
    return new Promise(async function(resolve, reject) {
        tracks = await get_tracks_playlist(extract_num_playlist(link))
        resolve(tracks)
    })
}

function extract_num_playlist(url) {
    const regex = /\/playlist\/(\d+)\/?/;
    const match = url.match(regex);

    if (match && match.length > 1) {
        return match[1];
    } else {
        return null;
    }
} 
  
function get_tracks_playlist(num_playlist) {
    return new Promise(async function(resolve, reject) {
        let url_playlist = `https://api.deezer.com/playlist/${num_playlist}/tracks`;
        let requestPlaylist = new Request(url_playlist);
        let tracks = []
        
        var reponse = await fetch(requestPlaylist).then(function (reponse) {return reponse.json()})
        tracks = tracks.concat(reponse.data)
        
        while (reponse.next != undefined) {
            reponse = await fetch(reponse.next).then(function (reponse) {return reponse.json()})
            tracks = tracks.concat(reponse.data)
        }
        resolve(tracks)
    })
}
