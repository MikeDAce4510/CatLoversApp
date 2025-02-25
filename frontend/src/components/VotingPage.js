import React, { useState, useEffect } from 'react';

const BACKEND_URL = 'http://localhost:5000';

function VotingPage() {
  const [currentImage, setCurrentImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomImage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/images/search`);
      const data = await response.json();
      setCurrentImage(data);
    } catch (error) {
      console.error('❌ Error fetching random image:', error);
      setError('Failed to load image.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (value) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to vote.');
      return;
    }

    if (!currentImage || !currentImage.id) {
      console.error('❌ No current image to vote on!');
      alert('No image loaded, please try again.');
      return;
    }

    try {
      console.log('✅ Sending vote request...');
      const response = await fetch(`${BACKEND_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_id: currentImage.id,
          value,
          image_url: currentImage.url,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit vote: ${response.statusText}`);
      }

      console.log('✅ Vote submitted successfully');
      await fetchRandomImage(); // Load a new image after voting
    } catch (error) {
      console.error('❌ Error submitting vote:', error);
      alert('Failed to vote, please try again.');
    }
  };

  useEffect(() => {
    fetchRandomImage();
  }, []);

  return (
    <div>
      <h1 className="banner">Vote for Your Favorite Cats! 🐾</h1>
      {loading ? <p>Loading image...</p> : null}
      {error ? <p>{error}</p> : null}
      {currentImage && (
        <div>
          <img src={currentImage.url} alt="Random Cat" className="cat-image" />
          <div>
            <button onClick={() => handleVote(1)}>Upvote</button>
            <button onClick={() => handleVote(-1)}>Downvote</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingPage;











