// Function to get an access token from the Spotify API
async function getAccessToken() {
    // Spotify application's client ID and client secret
    const clientId = '511566ebbfd841c2a2756783dae54748';
    const clientSecret = 'ec79b034190f426aaf7ae97c406cf4ad';
    // Spotify token URL for authentication
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    
    // Making a POST request to get an access token
    const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            // Content type for the request
            'Content-Type': 'application/x-www-form-urlencoded',
            // Basic Auth header using base64 encoding of client ID and secret
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        // Request body containing the grant type
        body: 'grant_type=client_credentials'
    });
    
    // Parsing the JSON response
    const data = await response.json();
    // Returning the access token from the response
    return data.access_token;
}

// Function to search for tracks using the Spotify API
async function searchTracks() {
    // Getting the track name input from the user
    const trackName = document.getElementById('track-name-input').value;
    
    // Getting the access token needed for API requests
    const accessToken = await getAccessToken();
    
    // Spotify API URL for searching tracks with a query parameter and limit
    const apiUrl = `https://api.spotify.com/v1/search?q=${trackName}&type=track&limit=10`;
    
    // Making a GET request to search for tracks
    fetch(apiUrl, {
        headers: {
            // Authorization header with the Bearer token
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        // Getting the element to display the track list
        const trackListDiv = document.getElementById('track-list');
        
        // Setting up the HTML structure for the track list
        trackListDiv.innerHTML = '<h2>Search Results:</h2>';
        
        // Looping through the track items in the response
        data.tracks.items.forEach(track => {
            // Appending each track's information to the track list div
            trackListDiv.innerHTML += `
                <div class="track-item">
                    <p><img src="${track.album.images[0].url}" alt="Track Image"></p>
                    <p>Track Name: ${track.name}</p>
                    <p>Artist: ${track.artists[0].name}</p>
                    <p>Album: ${track.album.name}</p>
                    <p>Release Date: ${track.album.release_date}</p>
                    <p><a href="${track.external_urls.spotify}" target="_blank">Listen on Spotify</a></p>
                </div>
            `;
        });
    })
    .catch(error => console.error('Error fetching data:', error)); // Handling any errors
}
