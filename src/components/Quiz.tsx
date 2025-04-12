import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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

const QuizTypeContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const QuizTypeButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) =>
    props.active ? props.theme.primary : props.theme.background};
  color: ${(props) => (props.active ? "white" : props.theme.text)};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.primaryHover : props.theme.border};
  }
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

const FillInBlankContainer = styled.div`
  margin-top: 20px;
`;

const BlankSpace = styled.span`
  display: inline-block;
  min-width: 100px;
  height: 30px;
  border-bottom: 2px solid ${(props) => props.theme.primary};
  margin: 0 5px;
`;

const DraggableWord = styled.div`
  display: inline-block;
  padding: 5px 10px;
  margin: 5px;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border-radius: 4px;
  cursor: move;
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
  const [quizType, setQuizType] = useState<"word" | "example">("word");
  const [currentQuiz, setCurrentQuiz] = useState<QuizType | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    generateNewQuiz();
  }, [words, quizType]);

  const generateNewQuiz = () => {
    if (words.length === 0) return;

    const randomWord = words[Math.floor(Math.random() * words.length)];
    let newQuiz: QuizType;

    if (quizType === "word") {
      const quizSubType = Math.floor(Math.random() * 2);

      if (quizSubType === 0) {
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
    } else {
      // 예문 문제
      if (randomWord.examples.length === 0) {
        generateNewQuiz();
        return;
      }

      const randomExample =
        randomWord.examples[
          Math.floor(Math.random() * randomWord.examples.length)
        ];
      newQuiz = {
        id: uuidv4(),
        type: "fill-in-blank",
        question: randomExample.sentence,
        answer: randomWord.word,
        exampleWordPosition: randomExample.wordPosition,
        exampleWordLength: randomExample.wordLength,
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

      <QuizTypeContainer>
        <QuizTypeButton
          active={quizType === "word"}
          onClick={() => setQuizType("word")}
        >
          단어 문제
        </QuizTypeButton>
        <QuizTypeButton
          active={quizType === "example"}
          onClick={() => setQuizType("example")}
        >
          예문 문제
        </QuizTypeButton>
      </QuizTypeContainer>

      <QuestionContainer>
        <QuestionText>
          {currentQuiz.type === "fill-in-blank" ? (
            <>
              {currentQuiz.question.slice(0, currentQuiz.exampleWordPosition)}
              <BlankSpace />
              {currentQuiz.question.slice(
                currentQuiz.exampleWordPosition! +
                  currentQuiz.exampleWordLength!
              )}
            </>
          ) : (
            currentQuiz.question
          )}
        </QuestionText>

        {currentQuiz.type !== "fill-in-blank" ? (
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
        ) : (
          <DndProvider backend={HTML5Backend}>
            <FillInBlankContainer>
              <DraggableWord>{currentQuiz.answer}</DraggableWord>
            </FillInBlankContainer>
          </DndProvider>
        )}
      </QuestionContainer>

      {showAnswer && (
        <NextButton onClick={handleNextQuestion}>다음 문제</NextButton>
      )}
    </QuizContainer>
  );
};

export default Quiz;
