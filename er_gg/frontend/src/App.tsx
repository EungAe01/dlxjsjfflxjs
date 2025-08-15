import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import MatchDetail from './components/MatchDetail';
import News from './components/News';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import PillNav from './components/PillNav/PillNav';
import logo from './logo.svg';

function AppNavbar() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      navigate(`/user/${nickname}`);
    }
  };
  return (
    <>
      <div>
        <PillNav
          logo={logo}
          logoAlt="Company Logo"
          items={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
            { label: 'Character', href: '/characters' },
            { label: 'Statistics', href: '/stats' },
          ]}
          activeHref={window.location.pathname}
          className="custom-nav"
          ease="power2.easeOut"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <Container>
        <p>&copy; {new Date().getFullYear()} ER.GG. All rights reserved.</p>
      </Container>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="container font-neodgm-pro">
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:nickname" element={<UserProfile />} />
          <Route path="/match/:gameId" element={<MatchDetail />} />
          <Route path="/news" element={<News />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
