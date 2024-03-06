import React, { useState } from 'react';
import axios from 'axios';

const QuestionUpdate = ({ questionId }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [isUpdated, setIsUpdated] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://127.0.0.1:8000/questions/${questionId}/`, { question, answer })
             .then(response => {
                 setIsUpdated(true);
                 // 성공적으로 수정된 후의 로직
             })
             .catch(error => {
                 console.error("There was an error updating the question!", error);
             });
    };

    return (
        <div>
            {isUpdated ? (
                <div>
                    <p>Question updated successfully!</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="질문" value={question} onChange={e => setQuestion(e.target.value)} />
                    <textarea placeholder="정답" value={answer} onChange={e => setAnswer(e.target.value)}></textarea>
                    <button type="submit">Update Question</button>
                </form>
            )}
        </div>
    );
};
export default QuestionUpdate;
