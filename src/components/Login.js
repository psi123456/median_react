// Login.js
import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.png';

const Login = ({ handleLoginStatus }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const showSignupForm = () => {
    setShowSignup(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      if (response.data.success) {
        const token = response.data.access_token;
        const username = response.data.username; // 응답에서 username 가져오기
        localStorage.setItem("token", token);
        localStorage.setItem('username', username); // username 저장
        localStorage.setItem('is_superuser', response.data.is_admin ? '1' : '0');
        const isAdmin = response.data.is_admin;
        console.log("isAdmin:", isAdmin);

        handleLoginStatus(true, isAdmin);
        navigate("/main");
      } else {
        alert("아이디 혹은 비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Login Failed!", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        newUsername: newUsername,
        newPassword: newPassword,
        address: address,
        email: email,
      });

      if (response.data.success) {
        alert("회원가입 성공");
        setNewUsername("");
        setNewPassword("");
        setAddress("");
        setEmail("");
        // Close the signup form and show the login form
        setShowSignup(false);
      } else {
        alert("회원가입 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("Signup Failed!", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    // Reset the input fields and show the login form
    setNewUsername("");
    setNewPassword("");
    setAddress("");
    setEmail("");
    setShowSignup(false);
  };

  return (
    <Container fluid style={{ backgroundColor: "#ffffcc", width:"700px"}}> {/* 연노란색 배경으로 수정 */}
      <Row className="justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Col xs={10} md={8} lg={6} className="text-center p-4 rounded" style={{ backgroundColor: "#ffffff", border: "2px solid #ffa500" }}>
          <img src={logo} alt="Logo" style={{ width: "100px", marginBottom: "20px" }} />
          <Form className="chuKo3">
            {showSignup ? (
              <div>
                <Form.Control
                  type="text"
                  placeholder="사용할 아이디 입력"
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "300px" }}
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                <Form.Control
                  type="password"
                  placeholder="사용할 비밀번호 입력"
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "300px" }}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Form.Control
                  type="text"
                  placeholder="주소 입력"
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "300px" }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Form.Control
                  type="email"
                  placeholder="이메일 입력"
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "300px" }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button variant="success" onClick={handleSignup} style={{ width: "200px", marginTop: "10px" }}>
                  회원가입
                </Button>
                <Button variant="primary btn-dark" onClick={handleCancel} style={{ width: "200px", marginTop: "10px" }}>
                  취소
                </Button>
              </div>
            ) : (
              <div>
                <Form.Control
                  type="text"
                  placeholder="아이디 혹은 이메일 주소를 입력하시오."
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "100%" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Control
                  type="password"
                  placeholder="비밀번호"
                  className="mb-2"
                  style={{ fontSize: "12px", padding: "15px", width: "100%" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="primary" style={{ width: "200px", marginTop: "10px" }} onClick={handleLogin}>
                  로그인
                </Button>
                <Button variant="success" onClick={showSignupForm} style={{ width: "200px", marginTop: "10px" }}>
                  회원가입
                </Button>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;