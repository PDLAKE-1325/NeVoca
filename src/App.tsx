import React, { useState, useEffect } from "react";
import styled, { ThemeProvider, DefaultTheme } from "styled-components";
import WordList from "./components/WordList";
import WordForm from "./components/WordForm";
import Quiz from "./components/Quiz";
import { Word, StoredWords } from "./types";
import * as serviceWorker from "./serviceWorker";

const lightTheme: DefaultTheme = {
  primary: "#007AFF",
  primaryHover: "#0056b3",
  background: "#F2F2F7",
  surface: "#FFFFFF",
  surfaceHover: "#F5F5F5",
  text: "#000000",
  textSecondary: "#6C6C6C",
  border: "#E5E5EA",
  error: "#FF3B30",
  errorHover: "#CC2F26",
};

const darkTheme: DefaultTheme = {
  primary: "#0A84FF",
  primaryHover: "#0056b3",
  background: "#000000",
  surface: "#1C1C1E",
  surfaceHover: "#2C2C2E",
  text: "#FFFFFF",
  textSecondary: "#8E8E93",
  border: "#38383A",
  error: "#FF453A",
  errorHover: "#CC2F26",
};

const AppContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  transition: background-color 0.3s, color 0.3s;
  overflow-x: hidden;
`;

const Header = styled.header`
  background-color: ${(props) => props.theme.surface};
  padding: 1rem;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  color: ${(props) => props.theme.text};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const NavButton = styled.button<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.primary : props.theme.surface};
  color: ${(props) => (props.active ? "white" : props.theme.text)};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  flex: 1;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.primary : props.theme.surfaceHover};
  }
`;

const Main = styled.main`
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
`;

const ThemeToggle = styled.button`
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 100;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"add" | "list" | "quiz">("add");
  const [words, setWords] = useState<Word[]>(() => {
    // 초기 상태를 localStorage에서 불러오기
    const savedWords = localStorage.getItem("words");
    if (savedWords) {
      try {
        const parsed: StoredWords = JSON.parse(savedWords);
        return parsed.words || [];
      } catch (error) {
        console.error("저장된 단어를 불러오는 중 오류가 발생했습니다:", error);
        return [];
      }
    }
    return [];
  });

  // 단어가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    const storedWords = {
      words,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem("words", JSON.stringify(storedWords));
  }, [words]);

  useEffect(() => {
    const storedData = localStorage.getItem("words");
    if (storedData) {
      const { words: storedWords } = JSON.parse(storedData);
      setWords(storedWords);
    }
  }, []);

  const handleAddWord = (newWord: Word) => {
    setWords((prevWords) => [...prevWords, newWord]);
  };

  const handleDeleteWord = (wordId: string) => {
    setWords((prevWords) => prevWords.filter((word) => word.id !== wordId));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppContainer>
        <Header>
          <Title>NeVoca</Title>
          <Nav>
            <NavButton
              active={activeTab === "add"}
              onClick={() => setActiveTab("add")}
            >
              단어 추가
            </NavButton>
            <NavButton
              active={activeTab === "list"}
              onClick={() => setActiveTab("list")}
            >
              단어장
            </NavButton>
            <NavButton
              active={activeTab === "quiz"}
              onClick={() => setActiveTab("quiz")}
            >
              문제풀기
            </NavButton>
          </Nav>
        </Header>

        <Main>
          {activeTab === "add" && <WordForm onAddWord={handleAddWord} />}
          {activeTab === "list" && (
            <WordList words={words} onDeleteWord={handleDeleteWord} />
          )}
          {activeTab === "quiz" && <Quiz words={words} />}
        </Main>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
