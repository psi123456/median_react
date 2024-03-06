import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
  // 상태 초기화
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [resultMessage, setResultMessage] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState({});

  // 질문을 불러오는 함수
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/questions/');
        setQuestions(response.data);
        const initialUserAnswers = response.data.reduce((acc, question) => ({
          ...acc,
          [question.id]: ''
        }), {});
        setUserAnswers(initialUserAnswers);
      } catch (error) {
        console.error('질문을 불러오는 데 실패했습니다:', error);
      }
    };

    fetchQuestions();
  }, []);

  

  // 답변 변경 핸들러
  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:8000/check-answers/');
      const resultsData = response.data.latest_results; 
  
      // 결과 데이터가 있는지 확인
      if (resultsData && resultsData.length) {
        // 결과 데이터를 뒤집어서 처리
        const reversedResults = resultsData.reverse();
        
        // 결과 데이터를 사용하여 결과 메시지 생성
        const resultsMessage = reversedResults.map((result, index) => (
  <span key={index}>
    문제: {result.question_text} 답변: {result.user_answer_text} {result.is_correct ? '맞았습니다' : '틀렸습니다'}
    <br />
  </span>
));
        
        console.log(resultsMessage);
        setResultMessage(resultsMessage);
      } else {
        setResultMessage('결과 데이터가 없습니다.');
      }
    } catch (error) {
      console.error('결과를 불러오는 데 실패했습니다:', error);
      setResultMessage(`결과 불러오기 실패: ${error.message}`);
    }
  };

  const questionIndexMap = questions.reduce((acc, question, index) => {
    acc[question.id] = index + 1;
    return acc;
  }, {});
  // 답변 제출 핸들러
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 각 질문에 대해 별도의 POST 요청을 보냅니다.
      for (const questionId of Object.keys(userAnswers)) {
        const payload = {
          question: questionId,
          user_response: userAnswers[questionId] || '',
          question_number: questionIndexMap[questionId],
        };

        await axios.post('http://localhost:8000/user-answers/', payload, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

      // 제출 성공 메시지
      console.log('모든 답변이 제출되었습니다.');

      // 답변 제출 후 결과 받아오기
      await fetchResults();

      // 각 질문에 대한 채점 결과를 가져와서 저장
      const response = await axios.get('http://localhost:8000/user-answers/');
      const userAnswersData = response.data;

      const userAnswersMap = {};
      userAnswersData.forEach(userAnswer => {
        userAnswersMap[userAnswer.question] = userAnswer.is_correct;
      });

      setCorrectAnswers(userAnswersMap);
    } catch (error) {
     
    if (error.response) {
      console.error('Error submitting answers:', error.response.data);
    } else {
      console.error('Error submitting answers:', error.message);
    }
    setResultMessage(`오류가 발생했습니다: ${error.message}`);
  }
};
  
  // 렌더링
  return (
    <div className="user-container">
      <h1 className="user-title">퀴즈</h1>
      <form onSubmit={handleSubmit} className="user-form">
        <ul className="user-question-list">
          {questions.map((question, index) => ( // index 추가
            <li key={question.id} className="user-question-item">
              <label htmlFor={`question-${question.id}`} className="user-question-label">
                {index + 1}. {question.question} 
              </label>
              <input
                id={`question-${question.id}`}
                type="text"
                value={userAnswers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="답변을 여기에 입력하세요"
                className="user-input"
              />
            </li>
          ))}
        </ul>
        <button type="submit" className="user-submit-btn">답변 제출</button>
      </form>
      {resultMessage && <p className="user-result-message">{resultMessage}</p>}
    </div>
  );
}

export default User;