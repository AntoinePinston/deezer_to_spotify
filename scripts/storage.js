//https://deezer.page.link/XRcZ9eKhfgaWY5rB7

function save_field(field) {
    var dataToSave = { playlist: field };
    chrome.storage.local.set(dataToSave, function() {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
    } else {
        console.log("Data saved successfully", field);
    }
    });
};

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
    var inputField = document.getElementById('inputField');
    var submitButton = document.getElementById('submitButton');
    var syncButton = document.getElementById('syncButton');

    submitButton.addEventListener('click', function () {
        var inputValue = String(inputField.value);
        save_field(inputValue);
    });

    syncButton.addEventListener('click', function () {
        get_field()
        .then(function(playlist) {
            request_deezer(playlist)
            .then(function(tracks) {
                tracks.forEach(function (element) {console.log(element)})
            });
        }    //  Qqc que cette merde 
    )});
});
