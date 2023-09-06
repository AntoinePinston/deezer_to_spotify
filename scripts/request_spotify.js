function get_user_id(token) {
    return new Promise(function(resolve, reject) {
        request = new Request("https://api.spotify.com/v1/me")
        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json()).then(data => console.log(data))
    })
}

