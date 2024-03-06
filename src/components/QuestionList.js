import React from 'react';

const QuestionList = ({ questions, onSelectQuestion, onDeleteQuestion, onUpdateQuestion }) => {
    if (!questions || questions.length === 0) {
        return <p>No questions available.</p>;
    }

    return (
        <div>
          {questions.map(question => (
            <div key={question.id}>
              <h3>{question.question}</h3>
              <p>{question.answer}</p>
              <button onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                onUpdateQuestion(question);
              }}>Update</button>
              <button onClick={(e) => {
                e.stopPropagation(); // Stop event propagation
                onDeleteQuestion(question.id);
              }}>Delete</button>
            </div>
          ))}
        </div>
      );
};

export default QuestionList;