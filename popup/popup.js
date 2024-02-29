const tokenChannel = new BroadcastChannel("token_spotify");
var tokenSpotify; 

function waitToken() {
    return new Promise((resolve) => {
        tokenChannel.onmessage = (event) => {
            resolve(event.data);
        };
    });
}

async function connectToSpotify() {
    var spotifyClient = "291641f3871b47668676c7a385fc9db1"
    var redirectUri = `chrome-extension://${chrome.runtime.id}/callback_spotify/callback.html`
    var url = "https://accounts.spotify.com/authorize?client_id=" + spotifyClient;
    url +=    "&response_type=code&redirect_uri="+ redirectUri;
    url +=    "&scope=user-read-private+user-read-email+playlist-modify-public+playlist-modify-private";
    url +=    "&show_dialog=true&interactive=true";
    
    if (tokenSpotify == null) {
        var spotifyId
        chrome.windows.create({url: url}, (window) => {
            spotifyId = window.id;
        })
        tokenSpotify = await waitToken()
        tokenChannel.close()

        if (spotifyId) {
            chrome.windows.remove(spotifyId)
        }
    }
    return tokenSpotify
}

document.addEventListener('DOMContentLoaded', async function () {
    // Get usefull document id
    let convertButton = document.getElementById('convert_button');
    let overlay = document.getElementById('overlay');
    let congrat = document.getElementById("congrats");

    tokenSpotify = await connectToSpotify();
    // Suppress the overlay
    overlay.style.display = "none";

    convertButton.addEventListener('click', async function () {
        congrat.style.display = "none"
        let deezerUrl = String(document.getElementById('deezerUrl').value)
        let tracks = await getDeezerTracks(deezerUrl)
        var id = await get_user_id(tokenSpotify)
        var playlist_id = await create_playlist(tokenSpotify, id, "DeezerToSpotify")
        await fill_playlist(tokenSpotify, playlist_id, tracks)
        congrat.style.display = "block"
    });
});
