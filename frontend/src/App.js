import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import VotingPage from './components/VotingPage';
import UserVotesPage from './components/UserVotesPage';
import AllUserVotesPage from './components/AllUserVotesPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/vote"
          element={
            <ProtectedRoute>
              <VotingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-votes"
          element={
            <ProtectedRoute>
              <UserVotesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-user-votes"
          element={
            <ProtectedRoute>
              <AllUserVotesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;






