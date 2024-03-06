import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pagination, Container, Button, Table} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title'); // 'title', 'content', 'titleAndContent', 'author'
    

    const navigate = useNavigate();
    // 검색 필터링 함수
    const applySearchCriteria = (post) => {
        switch (searchType) {
            case 'title':
                return post.title.toLowerCase().includes(searchTerm.toLowerCase());
            case 'content':
                return post.content.toLowerCase().includes(searchTerm.toLowerCase());
            case 'titleAndContent':
                return post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.content.toLowerCase().includes(searchTerm.toLowerCase());
            case 'author':
                // 작성자 정확한 일치로 필터링
                return post.author === searchTerm;
            default:
                return true;
        }
    };
    const executeSearch = () => {
        // 관리자 게시글 분리
        const superuserPosts = posts.filter(post => post.is_author_superuser);
    
        // 일반 게시글에 대해 검색 적용
        const regularPosts = posts.filter(post => !post.is_author_superuser);
        const filteredRegularPosts = regularPosts.filter(post => {
            return applySearchCriteria(post);
        });
    
        // 관리자 게시글을 검색 결과 상단에 고정
        setPosts([...superuserPosts, ...filteredRegularPosts]);
    };
    

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get("http://localhost:8000/api/board/");
            let posts = response.data.posts;
    
            // 슈퍼유저 게시글을 배열의 앞쪽으로, 일반 게시글을 오래된 순으로 정렬
            const superuserPosts = posts.filter(post => post.is_author_superuser);
            const regularPosts = posts.filter(post => !post.is_author_superuser);
            const sortedRegularPosts = regularPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
            setPosts([...superuserPosts, ...sortedRegularPosts]);
        };
        fetchPosts();
    }, [searchTerm, searchType]);

//const fetchPosts = async () => {
//        const response = await axios.get('http://localhost:8000/api/board/');
//        setPosts(response.data.posts);
//    };

    // 현재 페이지의 게시물 계산
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // 페이지네이션 핸들러
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

     // 전체 페이지 수 계산
     //const pageNumbers = [];
     //for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
     //    pageNumbers.push(i);
     //}

     // 현재 페이지에서의 시작 번호 계산
    const totalPosts = posts.length;
    const getPostNumber = (index) => {
        const post = currentPosts[index];
        if (post.is_author_superuser) return '';
    
        // 전체 일반 게시글 목록 필터링
        const regularPosts = posts.filter(post => !post.is_author_superuser);
        const regularPostsCount = regularPosts.length;
    
        // 현재 게시글의 전체 일반 게시글 목록 내 위치 찾기
        const currentPostIndex = regularPosts.findIndex(p => p.id === post.id);
    
        // 가장 오래된 글이 1번이 되도록 번호 계산
        return regularPostsCount - currentPostIndex;
    };

    const handleCreatePost = () => {
        navigate('/board/create');
    };

    const handleTitleClick = (postId, event) => {
        event.stopPropagation(); // 부모 요소로의 이벤트 전파 방지
        navigate(`/board/${postId}`);
    };

    return (
        <Container>
            <div className="my-4 p-3" style={{ backgroundColor: 'yellow' }}>
                <h2 className="text-center">자유게시판</h2>
            </div>
            <Table striped bordered hover>
                <thead style={{ backgroundColor: '#ffd700' }}>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>좋아요</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPosts.map((post, index) => (
                        <tr key={post.id} className={post.is_author_superuser ? 'table-danger' : ''}>
                            <td>{getPostNumber(index)}</td>
                            <td style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={(e) => handleTitleClick(post.id, e)}>{post.title}</td>
                            <td>{post.author}</td>
                            <td>{new Date(post.created_at).toLocaleDateString('ko-KR')}</td>
                            <td>{post.views}</td> {/* Display views */}
                            <td>{post.likes}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Pagination>
            {Array(Math.ceil(totalPosts / postsPerPage)).fill().map((_, i) => (
                    <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
            {/* 검색 입력 필드 */}
<div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
<input type="text" placeholder="검색" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
<select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
<option value="title">제목</option>
<option value="content">내용</option>
<option value="titleAndContent">제목+내용</option>
<option value="author">작성자</option>
</select>
<Button onClick={executeSearch}>검색</Button> {/* 검색 버튼 추가 */}
</div>
            <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" onClick={handleCreatePost}>글쓰기</Button>
            </div>

        </Container>
    );
};

export default PostList;