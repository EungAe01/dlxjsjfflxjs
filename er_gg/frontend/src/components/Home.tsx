
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Form, FormControl, Button } from 'react-bootstrap';

function Home() {
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
              <Button variant="outline-success" type="submit">검색</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-4">
        <h1 className="text-center mb-4">ER.GG에 오신 것을 환영합니다!</h1>
        <p className="text-center">이터널 리턴 통계 및 정보를 위한 최고의 리소스입니다.</p>

        {/* Placeholder for main content sections */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">최신 뉴스</h5>
                <p className="card-text">최신 패치, 이벤트 및 공지사항을 확인하세요.</p>
                <Button variant="primary">더 보기</Button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">인기 캐릭터</h5>
                <p className="card-text">가장 많이 플레이되고 승률이 높은 캐릭터를 찾아보세요.</p>
                <Button variant="primary">캐릭터 보기</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">게임 통계</h5>
                <p className="card-text">게임 데이터, 아이템 빌드 등을 자세히 살펴보세요.</p>
                <Button variant="primary">통계 탐색</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <Container>
          <p>&copy; {new Date().getFullYear()} ER.GG. 모든 권리 보유.</p>
        </Container>
      </footer>
    </>
  );
}

export default Home;
