import React, { useState } from 'react';

const App = () => {
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Handle text input change
    const handleTextChange = (e) => {
        setPostText(e.target.value);
    };

    // Handle form submission (posting to Bluesky)
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const response = await fetch('/post-to-bluesky', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: postText }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setPostText(''); // Clear the text area after success
            } else {
                setError('Error: ' + data.error);
            }
        } catch (err) {
            setError(err+'Error: Failed to post to Bluesky');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1>Post to Bluesky</h1>
            <textarea
                style={styles.textArea}
                value={postText}
                onChange={handleTextChange}
                placeholder="Write your post here..."
                rows="4"
                cols="50"
            ></textarea>
            <div>
                <button
                    style={styles.button}
                    onClick={handleSubmit}
                    disabled={loading || !postText.trim()}
                >
                    {loading ? 'Posting...' : 'Post to Bluesky'}
                </button>
            </div>
            {success && <p style={styles.success}>Post successful!</p>}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
    },
    textArea: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        resize: 'vertical',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        transition: 'background-color 0.3s',
    },
    success: {
        color: 'green',
        marginTop: '10px',
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
};

export default App;
