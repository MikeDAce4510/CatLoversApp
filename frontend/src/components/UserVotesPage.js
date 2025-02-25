import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = 'http://localhost:5000';

function UserVotesPage() {
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; // ✅ Prevent double execution
    hasFetched.current = true; // Mark as fetched

    const fetchUserVotes = async () => {
      console.log('🔍 Fetching user votes...');
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No token found');
        setError('Authentication required.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/api/votes/user-votes`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch votes: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);

        if (Array.isArray(data) && data.length === 0) {
          console.warn('⚠ No votes found.');
        }

        setUserVotes(data);
      } catch (err) {
        console.error('❌ Error fetching votes:', err);
        setError('Failed to load votes.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserVotes();
  }, []);

  if (loading) {
    return <p>Loading user votes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="banner">User Vote History</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {userVotes.length === 0 && !loading ? <p>No votes found.</p> : (
        <ul className="user-votes-list">
          {userVotes.map((vote) => (
            <li key={vote.id}>
              <img src={vote.image_url} alt="Cat" />
              <p><strong>{vote.username}</strong>: {vote.value > 0 ? 'Upvoted 🟢' : 'Downvoted 🔴'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserVotesPage;




