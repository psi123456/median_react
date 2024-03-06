import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/posts/${postId}/comments/`);
            if (response.data && response.data.comments) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error("Error fetching comments", error);
            // 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
        }
    };
    
    
    const postComment = async () => {
        if (newComment.trim() !== '') {
            try {
                const authorUsername = localStorage.getItem("username");
                const token = localStorage.getItem("token");

                await axios.post(`http://localhost:8000/api/posts/${postId}/comments/`, {
                    post_id: postId,
                    author: authorUsername,
                    content: newComment
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setNewComment('');
                await fetchComments();
            } catch (error) {
                console.error("Error posting comment", error);
                // 여기에 사용자에게 오류 메시지를 표시하는 로직을 추가할 수 있습니다.
            }
        }
    };
    
    
    useEffect(() => {
        fetchComments();
    }, [postId]);
    
    return (
        <div>
            <ListGroup>
                {comments.map(comment => (
                    <ListGroup.Item key={comment.id}>
                        <strong>{comment.author}</strong>: {comment.content}
                        <div className="comment-time">
                            작성 시간: {new Date(comment.created_at).toLocaleString('ko-KR')}
                        </div>
                        <div className="comment-actions">
                            <Button variant="outline-primary" size="sm">수정</Button>
<Button variant="outline-danger" size="sm">삭제</Button>
</div>
</ListGroup.Item>
))}
</ListGroup>
<Form>
<Form.Group>
<Form.Label>댓글 달기</Form.Label>
<Form.Control
as="textarea"
rows={3}
value={newComment}
onChange={(e) => setNewComment(e.target.value)}
/>
</Form.Group>
<Button onClick={postComment} disabled={!newComment.trim()}>댓글 작성</Button>
</Form>
</div>
);
};

export default Comments;