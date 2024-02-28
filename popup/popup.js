const token_channel = new BroadcastChannel("token_spotify");
var token_spotify; 

function waitToken() {
    return new Promise((resolve) => {
        token_channel.onmessage = (event) => {
            resolve(event.data);
        };
    });
}

async function click_button(value_button, token_spotify) {
    let tracks = await request_deezer(value_button)
    // TODO check if connection spotify done before
    var id = await get_user_id(token_spotify)
    var playlist_id = await create_playlist(token_spotify, id, "DeezerToSpotify")
    await fill_playlist(token_spotify, playlist_id, tracks)
}

async function connect_to_spotify() {
    var spotify_api_entrypoint = "291641f3871b47668676c7a385fc9db1"
    var redirect_uri = `chrome-extension://${chrome.runtime.id}/callback_spotify/callback.html`
    var url = "https://accounts.spotify.com/authorize?client_id=" + spotify_api_entrypoint;
    url +=    "&response_type=code&redirect_uri="+ redirect_uri;
    url +=    "&scope=user-read-private+user-read-email+playlist-modify-public+playlist-modify-private";
    url +=    "&show_dialog=true&interactive=true";
    
    if (token_spotify == null) {
        var spotify_id
        chrome.windows.create({url: url}, (window) => {
            spotify_id = window.id;
        })
        token_spotify = await waitToken()
        token_channel.close()

        if (spotify_id) {
            chrome.windows.remove(spotify_id)
        }
    }
    return token_spotify
}



document.addEventListener('DOMContentLoaded', async function () {
    let inputField = document.getElementById('inputField');
    let convert_button = document.getElementById('convert_button');

    token_spotify = await connect_to_spotify()

    convert_button.addEventListener('click', async function () {

        click_button(String(inputField), token_spotify)
        
    });
});
