import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
} from 'react-bootstrap';

function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Container className="my-4">
        <h1 className="text-center mb-4">ER.GG에 오신 것을 환영합니다!</h1>
        <p className="text-center">절망의 끝에 선 폰에게 모든 영광을.</p>

        {/* Placeholder for main content sections */}
        <div className="row mt-5">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">최신 뉴스</h5>
                <p className="card-text">
                  최신 패치, 이벤트 및 공지사항을 확인하세요.
                </p>
                <Button variant="primary" onClick={() => navigate('/news')}>
                  더 보기
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">인기 캐릭터</h5>
                <p className="card-text">
                  가장 많이 플레이되고 승률이 높은 캐릭터를 찾아보세요.
                </p>
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
                <p className="card-text">
                  게임 데이터, 아이템 빌드 등을 자세히 살펴보세요.
                </p>
                <Button variant="primary">통계 탐색</Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Home;
