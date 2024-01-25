const token_channel = new BroadcastChannel("token_spotify");
var token_spotify; 

function waitToken() {
    return new Promise((resolve) => {
        token_channel.onmessage = (event) => {
            resolve(event.data);
        };
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let inputField = document.getElementById('inputField');
    let spotifyButton = document.getElementById('spotifyButton');

    spotifyButton.addEventListener('click', async function () {
        var client_id = "291641f3871b47668676c7a385fc9db1"
        var redirect_uri = `chrome-extension://${chrome.runtime.id}/callback_spotify/callback.html`
        var url = "https://accounts.spotify.com/authorize?client_id=" + client_id;
        url +=    "&response_type=code&redirect_uri="+ redirect_uri;
        url +=    "&scope=user-read-private+user-read-email+playlist-modify-public+playlist-modify-private";
        url +=    "&show_dialog=false";

        var spotify_id
        chrome.windows.create({url: url}, (window) => {
            spotify_id = window.id;
        })

        token_spotify = await waitToken()
        token_channel.close()

        if (spotify_id) {
            chrome.windows.remove(spotify_id)
        }
        let inputValue = String(inputField.value);
        let tracks = await request_deezer(inputValue)
        // TODO check if connection spotify done before
        var id = await get_user_id(token_spotify)
        var playlist_id = await create_playlist(token_spotify, id, "DeezerToSpotify")
        await fill_playlist(token_spotify, playlist_id, tracks)
    });
});
