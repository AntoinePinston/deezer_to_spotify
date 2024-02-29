function getDeezerTracks(link) {
    return new Promise(async function(resolve) {
        tracks = await getTracksPlaylist(extractNumPlaylist(link))
        resolve(tracks)
    })
}

function extractNumPlaylist(url) {
    const regex = /\/playlist\/(\d+)\/?/;
    const match = url.match(regex);

    if (match && match.length > 1) {
        return match[1];
    } else {
        return null;
    }
} 
  
function getTracksPlaylist(num_playlist) {
    return new Promise(async function(resolve, reject) {
        let urlPlaylist = `https://api.deezer.com/playlist/${num_playlist}/tracks`;
        let requestPlaylist = new Request(urlPlaylist);
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
