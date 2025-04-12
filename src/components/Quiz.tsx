import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Word, Quiz as QuizType } from "../types";
import { v4 as uuidv4 } from "uuid";

const QuizContainer = styled.div`
  background-color: ${(props) => props.theme.surface};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const QuizTitle = styled.h2`
  margin-bottom: 20px;
  color: ${(props) => props.theme.text};
`;

const QuestionContainer = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  background-color: ${(props) => props.theme.background};
  border-radius: 5px;
`;

const QuestionText = styled.div`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: ${(props) => props.theme.text};
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionButton = styled.button<{
  isSelected?: boolean;
  isCorrect?: boolean;
}>`
  padding: 10px 15px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  background-color: ${(props) => {
    if (props.isCorrect) return props.theme.primary;
    if (props.isSelected) return props.theme.error;
    return props.theme.background;
  }};
  color: ${(props) =>
    props.isSelected || props.isCorrect ? "white" : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => {
      if (props.isCorrect) return props.theme.primaryHover;
      if (props.isSelected) return props.theme.errorHover;
      return props.theme.border;
    }};
  }
`;

const NextButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

interface QuizProps {
  words: Word[];
}

const Quiz: React.FC<QuizProps> = ({ words }) => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, [words]);

  const generateNewQuiz = () => {
    if (words.length === 0) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const quizType = Math.floor(Math.random() * 2);

    let newQuiz: QuizType;

    if (quizType === 0) {
      // 단어 -> 뜻
      newQuiz = {
        id: uuidv4(),
        type: "word-to-meaning",
        question: randomWord.word,
        answer: randomWord.meanings[0].definition,
        options: [
          randomWord.meanings[0].definition,
          ...words
            .filter((w) => w.id !== randomWord.id)
            .map((w) => w.meanings[0].definition)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3),
        ].sort(() => Math.random() - 0.5),
      };
    } else {
      // 뜻 -> 단어
      newQuiz = {
        id: uuidv4(),
        type: "meaning-to-word",
        question: randomWord.meanings[0].definition,
        answer: randomWord.word,
        options: [
          randomWord.word,
          ...words
            .filter((w) => w.id !== randomWord.id)
            .map((w) => w.word)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3),
        ].sort(() => Math.random() - 0.5),
      };
    }

    setCurrentQuiz(newQuiz);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    generateNewQuiz();
  };

  if (!currentQuiz) {
    return <QuizContainer>단어를 추가해주세요.</QuizContainer>;
  }

  return (
    <QuizContainer>
      <QuizTitle>문제 풀기</QuizTitle>
      <QuestionContainer>
        <QuestionText>{currentQuiz.question}</QuestionText>
        <OptionsContainer>
          {currentQuiz.options?.map((option) => (
            <OptionButton
              key={option}
              onClick={() => !showAnswer && handleAnswerSelect(option)}
              isSelected={selectedAnswer === option}
              isCorrect={showAnswer && option === currentQuiz.answer}
            >
              {option}
            </OptionButton>
          ))}
        </OptionsContainer>
      </QuestionContainer>

      {showAnswer && (
        <NextButton onClick={handleNextQuestion}>다음 문제</NextButton>
      )}
    </QuizContainer>
  );
};

export default Quiz;
