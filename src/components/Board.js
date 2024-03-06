import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PostList from './PostList';
import CreatePost from './CreatePost';
import PostDetail from './PostDetail';
import EditPost from './EditPost';

const Board = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/:postId" element={<PostDetail />} />
      <Route path="/edit/:postId" element={<EditPost />} />
    </Routes>
  );
};

export default Board;