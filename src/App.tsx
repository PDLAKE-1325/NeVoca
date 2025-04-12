import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import WordList from "./components/WordList";
import WordForm from "./components/WordForm";
import Quiz from "./components/Quiz";
import { Word, Theme } from "./types";

const darkTheme: Theme = {
  background: "#1a1a1a",
  surface: "#2d2d2d",
  text: "#ffffff",
  textSecondary: "#b3b3b3",
  primary: "#4CAF50",
  primaryHover: "#45a049",
  error: "#ff4444",
  errorHover: "#ff3333",
  border: "#404040",
};

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
`;

const Header = styled.header`
  background-color: ${(props) => props.theme.surface};
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h1`
  color: ${(props) => props.theme.text};
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${(props) =>
    props.active ? props.theme.primary : props.theme.surface};
  color: ${(props) => (props.active ? "white" : props.theme.textSecondary)};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background-color: ${(props) =>
      props.active ? props.theme.primaryHover : props.theme.border};
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"add" | "list" | "quiz">("add");
  const [words, setWords] = useState<Word[]>([]);

  const handleAddWord = (newWord: Word) => {
    setWords([...words, newWord]);
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

        <MainContent>
          {activeTab === "add" && <WordForm onAddWord={handleAddWord} />}
          {activeTab === "list" && <WordList words={words} />}
          {activeTab === "quiz" && <Quiz words={words} />}
        </MainContent>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;
