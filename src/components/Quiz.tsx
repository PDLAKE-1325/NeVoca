import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { Word, Quiz as QuizType } from "../types";

interface QuizProps {
  words: Word[];
}

const QuizContainer = styled.div`
  padding: 1rem;
`;

const QuizTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  background: none;
  color: ${(props) =>
    props.isActive ? props.theme.primary : props.theme.text};
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 2px solid
    ${(props) => (props.isActive ? props.theme.primary : "transparent")};
  transition: all 0.3s;

  &:hover {
    color: ${(props) => props.theme.primary};
  }
`;

const ScoreText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
  text-align: center;
`;

const QuestionText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
  text-align: center;
  word-break: break-all;
`;

const TranslationText = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
  text-align: center;
  font-style: italic;
`;

const OptionButton = styled.button<{ isSelected: boolean; isCorrect: boolean }>`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 2px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  background-color: ${(props) => {
    if (props.isSelected) {
      return props.isCorrect ? props.theme.primary : props.theme.error;
    }
    return props.theme.surface;
  }};
  color: ${(props) => (props.isSelected ? "white" : props.theme.text)};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  white-space: pre-line;

  &:hover {
    background-color: ${(props) => {
      if (props.isSelected) {
        return props.isCorrect
          ? props.theme.primaryHover
          : props.theme.errorHover;
      }
      return props.theme.surfaceHover;
    }};
  }
`;

const ResultText = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0;
  color: ${(props) => props.theme.text};
  text-align: center;
`;

const NextButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const Quiz: React.FC<QuizProps> = ({ words }) => {
  const [currentTab, setCurrentTab] = useState<"word" | "example">("word");
  const [currentQuiz, setCurrentQuiz] = useState<QuizType | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const generateWordQuiz = useCallback(() => {
    if (words.length < 2) {
      setCurrentQuiz(null);
      return;
    }

    const randomWord = words[Math.floor(Math.random() * words.length)];
    const otherWords = words.filter((w) => w.id !== randomWord.id);
    const quizType =
      Math.random() > 0.5 ? "word-to-meaning" : "meaning-to-word";

    if (quizType === "word-to-meaning") {
      const correctMeanings = randomWord.meanings
        .map((m, index) => `${index + 1}. ${m.definition}`)
        .join("\n");
      const otherMeanings = otherWords
        .map((w) =>
          w.meanings
            .map((m, index) => `${index + 1}. ${m.definition}`)
            .join("\n")
        )
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      setCurrentQuiz({
        id: randomWord.id,
        type: quizType,
        question: randomWord.word,
        answer: correctMeanings,
        options: [correctMeanings, ...otherMeanings].sort(
          () => Math.random() - 0.5
        ),
      });
    } else {
      const randomMeaningIndex = Math.floor(
        Math.random() * randomWord.meanings.length
      );
      const randomMeaning = randomWord.meanings[randomMeaningIndex];
      const randomOptions = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.word);

      setCurrentQuiz({
        id: randomWord.id,
        type: quizType,
        question: randomMeaning.definition,
        answer: randomWord.word,
        options: [...randomOptions, randomWord.word].sort(
          () => Math.random() - 0.5
        ),
      });
    }
  }, [words]);

  const generateExampleQuiz = useCallback(() => {
    if (words.length === 0) {
      setCurrentQuiz(null);
      return;
    }

    // 예문이 있는 단어들만 필터링
    const wordsWithExamples = words.filter((word) => word.examples.length > 0);
    if (wordsWithExamples.length === 0) {
      setCurrentQuiz(null);
      return;
    }

    const randomWord =
      wordsWithExamples[Math.floor(Math.random() * wordsWithExamples.length)];
    const randomExample =
      randomWord.examples[
        Math.floor(Math.random() * randomWord.examples.length)
      ];
    const otherWords = words.filter((w) => w.id !== randomWord.id);
    const randomOptions = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.word);

    setCurrentQuiz({
      id: randomWord.id,
      type: "example",
      question: randomExample.sentence.replace(/\*([^*]+)\*/g, "_____"),
      answer: randomExample.highlightedWord,
      options: [...randomOptions, randomExample.highlightedWord].sort(
        () => Math.random() - 0.5
      ),
      translation: randomExample.translation,
    });
  }, [words]);

  const generateNewQuiz = useCallback(() => {
    if (currentTab === "word") {
      generateWordQuiz();
    } else {
      generateExampleQuiz();
    }
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentTab, generateWordQuiz, generateExampleQuiz]);

  useEffect(() => {
    generateNewQuiz();
  }, [generateNewQuiz]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    setTotalQuestions((prev) => prev + 1);
    if (option === currentQuiz?.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    generateNewQuiz();
  };

  const handleTabChange = (tab: "word" | "example") => {
    setCurrentTab(tab);
    setScore(0);
    setTotalQuestions(0);
  };

  if (!currentQuiz) {
    return (
      <QuizContainer>
        <QuizTitle>문제 풀기</QuizTitle>
        <TabsContainer>
          <Tab
            isActive={currentTab === "word"}
            onClick={() => handleTabChange("word")}
          >
            단어 문제
          </Tab>
          <Tab
            isActive={currentTab === "example"}
            onClick={() => handleTabChange("example")}
          >
            예문 문제
          </Tab>
        </TabsContainer>
        <ResultText>
          {currentTab === "word"
            ? "단어가 2개 이상 필요합니다."
            : "예문이 있는 단어가 필요합니다."}
        </ResultText>
      </QuizContainer>
    );
  }

  return (
    <QuizContainer>
      <QuizTitle>문제 풀기</QuizTitle>
      <TabsContainer>
        <Tab
          isActive={currentTab === "word"}
          onClick={() => handleTabChange("word")}
        >
          단어 문제
        </Tab>
        <Tab
          isActive={currentTab === "example"}
          onClick={() => handleTabChange("example")}
        >
          예문 문제
        </Tab>
      </TabsContainer>
      <ScoreText>
        점수: {score}/{totalQuestions}
      </ScoreText>
      <QuestionText>
        {currentQuiz.type === "word-to-meaning" ? (
          <>
            <strong>{currentQuiz.question}</strong>의 뜻은?
          </>
        ) : currentQuiz.type === "meaning-to-word" ? (
          <>
            <strong>{currentQuiz.question}</strong>에 해당하는 단어는?
          </>
        ) : (
          currentQuiz.question
        )}
      </QuestionText>
      {currentQuiz.translation && (
        <TranslationText>{currentQuiz.translation}</TranslationText>
      )}
      {currentQuiz.options?.map((option) => (
        <OptionButton
          key={option}
          onClick={() => handleOptionSelect(option)}
          isSelected={selectedOption === option}
          isCorrect={option === currentQuiz.answer}
        >
          {option}
        </OptionButton>
      ))}
      {isAnswered && (
        <>
          <ResultText>
            {selectedOption === currentQuiz.answer ? (
              "정답입니다!"
            ) : (
              <>
                틀렸습니다.
                <br />
                정답: {currentQuiz.answer}
              </>
            )}
          </ResultText>
          <NextButton onClick={handleNextQuestion}>다음 문제</NextButton>
        </>
      )}
    </QuizContainer>
  );
};

export default Quiz;
