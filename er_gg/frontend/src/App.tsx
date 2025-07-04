
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import MatchDetail from './components/MatchDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:nickname" element={<UserProfile />} />
          <Route path="/match/:gameId" element={<MatchDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
