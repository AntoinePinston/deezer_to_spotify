const token_chanel = new BroadcastChannel("token_spotify");

document.addEventListener('DOMContentLoaded', function () {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var code = urlParams.get("code");

    if (code) {
        const baseURL = 'https://accounts.spotify.com/api/token';
        const redirectURI = `chrome-extension://${chrome.runtime.id}/callback_spotify/callback.html`;

        const data = new URLSearchParams();
        data.append('grant_type', "authorization_code");
        data.append('code', code);
        data.append('redirect_uri', redirectURI);

        const cred = "MjkxNjQxZjM4NzFiNDc2Njg2NzZjN2EzODVmYzlkYjE6OGU4NGY0OWRhYzExNDg5OGJhYzU0YTlhNmQ1NmVjOGE=";
        const headers = {
            'Authorization': `Basic ${cred}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const options = {
            method: 'POST',
            headers: headers,
            body: data
        };

        fetch(baseURL, options)
          .then((response) => response.json())
          .then((data) => {
              const accessToken = data.access_token;
              token_chanel.postMessage(accessToken);
          })
    }
});