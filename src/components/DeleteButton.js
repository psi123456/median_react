import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteButton = ({ questionId, refreshQuestions }) => {
    const handleDelete = () => {
        axios.delete(`http://127.0.0.1:8000/questions/${questionId}/`)
             .then(response => {
                 refreshQuestions(); // 질문 목록을 다시 불러옴
             })
             .catch(error => {
                 console.error("There was an error deleting the question!", error);
             });
    };

    return (
        <button onClick={handleDelete}>Delete Question</button>
    );
};
export default DeleteButton;