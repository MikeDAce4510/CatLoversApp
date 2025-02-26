// AllUserVotesPage.js
import React, { useState, useEffect } from 'react';

import BACKEND_URL from "../config";


function AllUserVotesPage() {
    const [allVotes, setAllVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchAllVotes() {
        console.log('🔍 Fetching all user votes...');
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
          const response = await fetch(`${BACKEND_URL}/api/votes/all-votes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch all user votes: ${response.statusText}`);
          }
  
          const data = await response.json();
          console.log('✅ API Response:', data);
          setAllVotes(data);
        } catch (err) {
          console.error('❌ Error fetching all user votes:', err);
          setError('Failed to load votes.');
        } finally {
          setLoading(false);
        }
      }
  
      fetchAllVotes();
    }, []);
  
    return (
      <div>
        <h1 className="banner">All Users' Voting History</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {allVotes.length === 0 && !loading ? <p>No votes found.</p> : (
          <ul className="user-votes-list">
            {allVotes.map((vote) => (
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
  
  export default AllUserVotesPage;
