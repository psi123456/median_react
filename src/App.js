import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './App.css';
import logo from './logo.png';
import Model from './components/model';
import Login from './components/Login';
import Main from './components/Main';
import MediFree from './components/medi_free';
import MediFreeAdmin from './components/medi_free_admin';
import TableComponent from './components/TableComponent';
import UserManager from './components/UserManager';
import Map from './components/Map';
import Quiz from './components/Quiz';
import User from './components/User';
import Board from './components/Board';

function App() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');

  const handleLoginClick = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

   // 메인 컨텐츠 영역에 적용할 스타일
   const mainStyle = {
    transform: isNavExpanded ? 'translateX(250px)' : 'translateX(0)',
    transition: 'transform 0.35s ease-out',
    width: '100%'
  };

  return (
    <BrowserRouter>
      <div className="navbar-container">
        {isLoggedIn && (
          <Navbar expand={false} fixed="top">
            <Container>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav fixed-top fixed-left"
                onClick={() => setIsNavExpanded(!isNavExpanded)}
              />
              <Navbar.Brand as={Link} to="/main">
                <img src={logo} width="40" height="40" className="d-inline-block align-top" alt="로고" />
                MEDISORT AI
              </Navbar.Brand>
              <Nav className="ml-auto">
                <Nav.Link as={Link} to="/" onClick={handleLogoutClick}>
                  로그아웃
                </Nav.Link>
              </Nav>
            </Container>
          </Navbar>
        )}
      </div>

      <div className="mx-auto" style={{ margin_top: '50px', overflow_y: 'visible', height: '90vh'}}>
        {/* isLoggedIn이 참일 때만 Sidebar를 렌더링 */}
        {isLoggedIn && (
          <CSSTransition
            in={isNavExpanded}
            timeout={350}
            classNames="nav-transition"
            style={{ position: 'fixed', zIndex: '1' }}
            unmountOnExit
          >
            <div className="side-nav" style={{ zIndex: '2' }}>
              <Nav defaultActiveKey="/home" className="flex-column ml-5">
                <Link to="/model" className="nav-link">
                  모델 서비스
                </Link>
                {isAdmin ? (
                  <Link to="/medi_free_admin" className="nav-link">
                    의약품 설명(관리자)
                  </Link>
                ) : (
                  <Link to="/medi_free" className="nav-link">
                    의약품 설명
                  </Link>
                )}
                <Link to="/TableComponent" className="nav-link">
                  유통기한
                </Link>
                <Link to="/user-questions" className="nav-link">퀴즈</Link>
                {isAdmin === true ? (
                  <Link to="/quiz" className="nav-link">퀴즈 관리자</Link>
                ) : null}
                <Link to="/board" className="nav-link">
                  자유게시판
                </Link>
                <Link to="/Map" className="nav-link">
                  지도
                </Link>
                {isAdmin === true ? (
                  <Link to="/UserManager" className="nav-link">사용자 관리</Link>
                ) : null}
              </Nav>
            </div>
          </CSSTransition>
        )}

        <div className="main-container">
          <main className="mx-auto">
            <Routes>
              <Route
                path="/"
                element={<Login handleLoginStatus={(isLoggedIn, isAdmin) => {
                  setIsLoggedIn(isLoggedIn);
                  setIsAdmin(isAdmin);
                }} />}
              />
              <Route path="/main" element={<Main />} />
              <Route path="/medi_free" element={<MediFree />} />
              <Route path="/medi_free_admin" element={<MediFreeAdmin />} />
              <Route path="/model" element={<Model />} />
              <Route path="/TableComponent" element={<TableComponent />} />
              <Route path="/UserManager" element={<UserManager />} />
              <Route path="/Map" element={<Map />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/user-questions" element={<User />} />
              <Route path="/board/*" element={<Board />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
