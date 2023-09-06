//https://deezer.page.link/XRcZ9eKhfgaWY5rB7

function save_field(field) {
    let dataToSave = { playlist: field };
    chrome.storage.local.set(dataToSave, function() {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else {
        console.log("Data saved successfully", field);
    }
    });
}

function get_field() {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get("playlist")
        .then(function(data) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                reject(chrome.runtime.lastError);
            } else {
                console.log("Retrieved data:", data.playlist);
                resolve(String(data.playlist));
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    let inputField = document.getElementById('inputField');
    let submitButton = document.getElementById('submitButton');
    let syncButton = document.getElementById('syncButton');
    let spotifyButton = document.getElementById('spotifyButton');

    submitButton.addEventListener('click', function () {
        let inputValue = String(inputField.value);
        save_field(inputValue);
    });

    syncButton.addEventListener('click', function () {
        get_field()
        .then(function(playlist) {
            request_deezer(playlist)
            .then(function(tracks) {
                tracks.forEach(function (element) {console.log(element)})
            });
        }
    )});

    spotifyButton.addEventListener('click', function () {
        var client_id = "291641f3871b47668676c7a385fc9db1"
        var redirect_uri = 'chrome-extension://godlifgnpblhinnodgkjpblbadellokf/callback_spotify/callback.html'

        let url = "https://accounts.spotify.com/authorize?client_id=" + client_id + "&response_type=code&redirect_uri=" + redirect_uri;
        chrome.windows.create({url: url});
    });
});
