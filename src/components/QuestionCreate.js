import React, { useState } from 'react';
import axios from 'axios';

const QuestionCreate = ({ refreshQuestions }) => {
  const [question, setquestion] = useState(''); // "질문" 상태값 변경
  const [answer, setanswer] = useState(''); // "정답" 상태값 변경

  const handleSubmit = (e) => {
    e.preventDefault();

    // 입력값 검증
    if (!question.trim() || !answer.trim()) {
        alert('질문과 정답을 모두 입력해주세요.');
        return;
      }
    
      // 요청 데이터 로깅
      console.log('Sending request with data:', { question, answer });
    
      axios.post('http://127.0.0.1:8000/questions/', { question, answer })
        .then(response => {
          console.log('Question created successfully:', response.data);
          setquestion('');
          setanswer('');
          refreshQuestions();
        })
        .catch(error => {
          console.error('Error creating question:', error);
          const errorMessage = error.response && error.response.data ? error.response.data.detail : error.message;
          alert('질문 생성 중 오류가 발생했습니다: ' + errorMessage);
        });
    };

  return (
    <div>
      <h2>Create a Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="question"
          value={question}
          onChange={e => setquestion(e.target.value)} // 상태값 변경 함수 수정
        />
        <textarea
          placeholder="answer"
          value={answer}
          onChange={e => setanswer(e.target.value)} // 상태값 변경 함수 수정
        ></textarea>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default QuestionCreate;