import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './quiz.css';
import QuestionCreate from './QuestionCreate';
import QuestionList from './QuestionList';
import QuestionUpdate from './QuestionUpdate';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false); // 수정 완료 상태 추가
  
  useEffect(() => {
    refreshQuestions();
  }, []);

  const refreshQuestions = () => {
    axios.get('http://127.0.0.1:8000/questions/')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
    setIsUpdated(false); 
  };

  const handleUpdateQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleDeleteQuestion = (questionId) => {
    axios.delete(`http://127.0.0.1:8000/questions/${questionId}/`)
      .then(response => {
        refreshQuestions();
        if (selectedQuestion && selectedQuestion.id === questionId) {
          setSelectedQuestion(null); // 현재 선택된 질문이 삭제된 경우 선택 해제
          }
          })
          .catch(error => {
          console.error("Error deleting question:", error);
          });
          };

          return (
            <div className="quiz-container">
            <h1>Quiz</h1>
            
            <QuestionCreate refreshQuestions={refreshQuestions} />
            <QuestionList 
                 questions={questions}
                 onSelectQuestion={handleSelectQuestion}
                 onUpdateQuestion={handleUpdateQuestion}
                 onDeleteQuestion={handleDeleteQuestion}
               />
            {selectedQuestion && (
               <QuestionUpdate 
                   questionId={selectedQuestion.id}
                   refreshQuestions={refreshQuestions}
                 />
            )}
            </div>
            );
            };

export default Quiz;
