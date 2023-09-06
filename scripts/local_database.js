function saveLocal(key, field) {
    let dataToSave = { key: field };
    chrome.storage.local.set(dataToSave, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        } else {
            console.log("Data saved successfully", key, field);
        }
    });
}

function getField(key) {
    return new Promise(function(resolve, reject) {
        chrome.storage.local.get(key)
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

