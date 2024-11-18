const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

// Set up your Bluesky credentials
const blueskyId = 'dominospizzas.bsky.social';
const blueskyPassword = 'parassareen1';

// Initialize Express
const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Route to handle the text post
app.post('/post-to-bluesky', async (req, res) => {
    const { text } = req.body;

    // Ensure that text is provided
    if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, error: 'Post text is required' });
    }

    // Step 1: Get authentication token from Bluesky (using your credentials)
    try {
        const authResponse = await axios.post('https://bsky.social/xrpc/com.atproto.server.createSession', {
            identifier: blueskyId,
            password: blueskyPassword
        });

        // Check if the response contains a valid JWT token
        const token = authResponse.data.accessJwt;
        if (!token) {
            throw new Error('Failed to authenticate with Bluesky');
        }

        // Step 2: Post the text to Bluesky
        const postResponse = await axios.post('https://bsky.social/xrpc/app.bsky.feed.post', {
            text: text,
            // Add other necessary parameters (e.g., media, visibility) if required by the API
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        // Check if the post was successful
        if (postResponse.status === 200) {
            res.json({ success: true, message: 'Successfully posted to Bluesky' });
        } else {
            res.json({ success: false, error: 'Failed to post to Bluesky' });
        }
    } catch (error) {
        console.error('Error posting to Bluesky:', error.message);
        res.json({ success: false, error: error.message || 'Error posting to Bluesky' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
