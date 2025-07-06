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
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">ER.GG</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">홈</Nav.Link>
              <Nav.Link href="/news">뉴스</Nav.Link>
              <Nav.Link href="/characters">캐릭터</Nav.Link>
              <Nav.Link href="/items">아이템</Nav.Link>
            </Nav>
            <Form className="d-flex" onSubmit={handleSubmit}>
              <FormControl
                type="search"
                placeholder="닉네임 검색"
                className="me-2"
                aria-label="Search"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button variant="outline-success" type="submit">
                검색
              </Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
