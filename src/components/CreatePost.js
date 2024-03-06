import React, { useState } from "react";
import axios from "axios";
import { Container, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ onPostCreated }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(""); // State to store the error message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setError("제목과 내용을 입력해주세요."); // Set error if title or content is empty
            return;
        }
        try {
            console.log({ title, content, author: localStorage.getItem("username") }); 
            
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8000/api/board/", {
                title,
                content,
                author: localStorage.getItem("username"),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // onPostCreated();
            setTitle("");
            setContent("");
            navigate('/board'); // 게시글 작성 후 PostList 페이지로 이동
        } catch (error) {
            console.error("Error adding post", error);
        }
    };
    const handleCancel = () => {
      navigate('/board'); // 취소 버튼 클릭 시 PostList 페이지로 이동
    };

    return (
        <Container>
            <h1>게시글 작성</h1>
            <Form onSubmit={handleSubmit}>
                {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control type="text" placeholder="제목 입력" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="내용 입력" value={content} onChange={(e) => setContent(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    게시글 작성
                </Button>
                <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: "10px" }}>
                    취소
                </Button>
            </Form>
        </Container>
    );
};

export default CreatePost;

