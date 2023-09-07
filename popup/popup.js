const token_channel = new BroadcastChannel("token_spotify");

function waitToken() {
    return new Promise((resolve) => {
        token_channel.onmessage = (event) => {
            resolve(event.data);
        };
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let inputField = document.getElementById('inputField');
    let submitButton = document.getElementById('submitButton');
    let syncButton = document.getElementById('syncButton');
    let spotifyButton = document.getElementById('spotifyButton');

    submitButton.addEventListener('click', function () {
        let inputValue = String(inputField.value);
        saveLocal("playlist", inputValue);
    });

    syncButton.addEventListener('click', function () {
        getField("playlist")
        .then(function(playlist) {
            request_deezer(playlist)
            .then(function(tracks) {
                tracks.forEach(function (element) {console.log(element)})
            });
        }
    )});

    spotifyButton.addEventListener('click', async function () {
        var client_id = "291641f3871b47668676c7a385fc9db1"
        var redirect_uri = 'chrome-extension://godlifgnpblhinnodgkjpblbadellokf/callback_spotify/callback.html'
        var url = "https://accounts.spotify.com/authorize?client_id=" + client_id;
        url += "&response_type=code&redirect_uri="+ redirect_uri;
        url += "&scope=user-read-private+user-read-email+playlist-modify-public+playlist-modify-private";
        url += "&show_dialog=true";

        var spotify_id
        chrome.windows.create({url: url}, (window) => {
            spotify_id = window.id;
        })

        var token_spotify = await waitToken()
        token_channel.close()

        if (spotify_id) {
            chrome.windows.remove(spotify_id, () => {})
        }

        var id = await get_user_id(token_spotify)
        playlist_id = await create_playlist(token_spotify, id, "test")
        console.log(playlist_id)
    });
});
