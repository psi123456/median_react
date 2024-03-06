// PostDetail 컴포넌트
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Form, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from 'react-router-dom';

const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [hasIncreased, setHasIncreased] = useState(false); // 조회수 증가 여부를 추적하는 상태
    const [comments, setComments] = useState([]); // 댓글 저장
    const [newComment, setNewComment] = useState(""); // 새 댓글 입력 처리
    const { postId } = useParams();
    const navigate = useNavigate();

    const currentUser = localStorage.getItem("username");
    const isSuperuser = localStorage.getItem("is_superuser") === '1'; // 관리자 여부 확인


    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/board/${postId}`);
            setPost(response.data);
            const commentsResponse = await axios.get(`http://localhost:8000/api/posts/${postId}/comments/`);
            setComments(commentsResponse.data.comments);
        } catch (error) {
            console.error("Error fetching post", error);
        }
    };

    // 기존 useEffect 내에서 조회수 증가 로직 분리
useEffect(() => {
    increaseViewCount();
}, []); // 빈 의존성 배열을 사용하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

useEffect(() => {
    fetchPost();
}, [postId]); // postId가 변경될 때마다 fetchPost 실행

const increaseViewCount = async () => {
    if (!hasIncreased) {
        try {
            await axios.get(`http://localhost:8000/api/board/${postId}?increase_view=true`);
            setHasIncreased(true); // 조회수 증가 후 상태 업데이트
        } catch (error) {
            console.error("Error increasing view count", error);
        }
    }
};
    
    const handleBackToList = () => {
         navigate('/board/'); // 게시글 목록 페이지로 이동
     };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:8000/api/board/${postId}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPost(prevPost => ({
                ...prevPost,
                likes: prevPost.likes + 1
            }));
        } catch (error) {
            console.error("Error updating like", error);
        }
    };
    const handleEdit = () => {
      navigate(`/board/edit/${postId}`);
  };
   const handleDelete = async () => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/board/${postId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        navigate('/board/'); // 게시글 목록 페이지로 이동
    } catch (error) {
        console.error("Error deleting post", error);
    }
}
const handleNewComment = async () => {
    // 댓글 내용이 비어있는지 확인
    if (!newComment.trim()) {
        alert("내용을 입력하세요."); // 경고 메시지 표시
        return; // 함수 실행 중단
    }
    try {
        const token = localStorage.getItem("token");
        await axios.post(`http://localhost:8000/api/posts/${postId}/comments/`, {
            post_id: postId,
            author: currentUser,
            content: newComment
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setNewComment("");
        fetchPost(); // 댓글 새로고침
    } catch (error) {
        console.error("Error creating new comment", error);
    }
};

const editComment = async (commentId) => {
    
    const newContent = prompt("댓글을 수정하세요:");
    if (newContent) {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:8000/api/comments/${commentId}/`, {
                content: newContent
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                    }
                    });
                    fetchPost(); // 댓글 새로고침
                    } catch (error) {
                    console.error("Error updating comment", error);
                    }
                    }
                    };
                    
                    const deleteComment = async (commentId) => {
                    if (window.confirm("이 댓글을 삭제하시겠습니까?")) {
                    try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`http://localhost:8000/api/comments/${commentId}/`, {
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                    });
                    fetchPost(); // 댓글 새로고침
                    } catch (error) {
                    console.error("Error deleting comment", error);
                    }
                    }
                    };
                    const renderComments = () => {
                        
                        return (
                            <ListGroup>
                                {comments.map((comment) => (
                                    <ListGroup.Item key={comment.id}>
                                        <p>{comment.author}: {comment.content}</p>
                                        <p>{new Date(comment.created_at).toLocaleDateString('ko-KR')}</p>
                                        {comment.author === currentUser || isSuperuser ? (
                                            <div>
                                                <Button variant="outline-primary" size="sm" onClick={() => editComment(comment.id)}>수정</Button>
                                                <Button variant="outline-danger" size="sm" onClick={() => deleteComment(comment.id)}>삭제</Button>
                                            </div>
                                        ) : null}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        );
                    };
    if (!post) return <div>Loading...</div>;

    return (
        <Container>
            <Card className="mt-3">
                <Card.Body>
                    제목: <Card.Title>{post.title}</Card.Title>
                    내용: <Card.Text>{post.content}</Card.Text>
                    <footer className="blockquote-footer">
                        작성자: {post.author}<br/>
                        작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}
                    </footer>
                    <div>조회수: {post.views}</div> {/* 조회수 표시 */}
                    <Button variant="success" onClick={handleLike} style={{ marginRight: "10px" }}>
                        좋아요 ({post.likes})
                    </Button>
                    {post.author === currentUser || isSuperuser ? (
                        <>
                            <Button variant="secondary" onClick={handleEdit}>수정</Button>
                            <Button variant="danger" onClick={handleDelete}>삭제</Button>
                        </>
                    ): null}
                    <Button variant="info" onClick={handleBackToList} style={{ marginRight: "10px" }}>목록으로</Button>
                </Card.Body>
            </Card>
            <Form>
            <Form.Group className="mb-3" controlId="commentInput">
                <Form.Control as="textarea" rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글 작성..." />
            </Form.Group>
            <Button variant="primary" onClick={handleNewComment}>댓글 제출</Button>
        </Form>
        <h3 className="mt-3">댓글</h3>
        {renderComments()}
        </Container>
    );
};

export default PostDetail;