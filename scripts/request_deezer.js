function request_deezer(sharedLink) {
    return new Promise(function(resolve, reject) {
        //https://deezer.page.link/XRcZ9eKhfgaWY5rB7
        let requestSharedLink = new Request(sharedLink);

        fetch(requestSharedLink)
        .then(function (reponse) {
            return reponse.url;
        })
        .then(function (url) {
            resolve(get_playlist(extract_num_playlist(url)));
    });
    })
}

function extract_num_playlist(url) {
    // Utilisation d'une expression régulière pour extraire les numéros
    const regex = /\/playlist\/(\d+)\?/;
    const match = url.match(regex);
  
    // Si des correspondances sont trouvées, retourner le numéro
    if (match && match.length > 1) {
        return match[1];
    } else {
        // Retourner null si aucune correspondance n'est trouvée
        return null;
    }
} 
  
function get_playlist(num_playlist) {
    return new Promise(function(resolve, reject) {
        let url_playlist = "https://api.deezer.com/playlist/" + num_playlist;
        let requestPlaylist = new Request(url_playlist);

        fetch(requestPlaylist)
        .then(function (reponse) {
            return reponse.json();
        })
        .then(function (json) {
            let tracks = json.tracks.data
            resolve(tracks);
        })
    })
}
