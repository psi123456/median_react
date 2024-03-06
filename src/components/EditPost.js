import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/board/${postId}`);
            setTitle(response.data.title);
            setContent(response.data.content);
        } catch (error) {
            console.error("Error fetching post", error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:8000/api/board/${postId}/`, {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate(`/board/${postId}`);
        } catch (error) {
            console.error("Error updating post", error);
        }
    };
    const handleCancel = () => {
        navigate(`/board/${postId}`); // 게시글 상세 페이지로 이동
    };


    return (
        <Container>
            <h1>게시글 수정</h1>
            <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>제목</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>내용</Form.Label>
                    <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
                </Form.Group>
                <Button variant="primary" type="submit">수정 완료</Button>
                <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: "10px" }}>취소</Button>
            </Form>
        </Container>
    );
};

export default EditPost;