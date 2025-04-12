import React, { useState } from "react";
import styled from "styled-components";
import { Word } from "../types";

const ListContainer = styled.div`
  background-color: ${(props) => props.theme.surface};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ListTitle = styled.h2`
  margin-bottom: 20px;
  color: ${(props) => props.theme.text};
`;

const WordCard = styled.div`
  border: 1px solid ${(props) => props.theme.border};
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.background};
`;

const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const WordTitle = styled.h3`
  color: ${(props) => props.theme.text};
  margin: 0;
`;

const DeleteButton = styled.button`
  background-color: ${(props) => props.theme.error};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.errorHover};
  }
`;

const ContentContainer = styled.div<{ isExpanded: boolean }>`
  max-height: ${(props) => (props.isExpanded ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  margin-top: ${(props) => (props.isExpanded ? "15px" : "0")};
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  color: ${(props) => props.theme.text};
  margin-bottom: 10px;
`;

const MeaningList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MeaningItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.surface};
  border-radius: 4px;
  color: ${(props) => props.theme.text};
  display: flex;
  gap: 10px;
`;

const Number = styled.span`
  color: ${(props) => props.theme.primary};
  font-weight: bold;
`;

const ExampleList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ExampleItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.surface};
  border-radius: 4px;
  display: flex;
  gap: 10px;
`;

const ExampleText = styled.div`
  color: ${(props) => props.theme.text};
`;

const ExampleTranslation = styled.div`
  color: ${(props) => props.theme.textSecondary};
  font-style: italic;
  margin-top: 5px;
  font-size: 0.9rem;
`;

const HighlightedWord = styled.span`
  color: ${(props) => props.theme.primary};
  font-weight: bold;
`;

interface WordListProps {
  words: Word[];
  onDeleteWord: (wordId: string) => void;
}

const WordList: React.FC<WordListProps> = ({ words, onDeleteWord }) => {
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

  const toggleWord = (wordId: string) => {
    const newExpandedWords = new Set(expandedWords);
    if (newExpandedWords.has(wordId)) {
      newExpandedWords.delete(wordId);
    } else {
      newExpandedWords.add(wordId);
    }
    setExpandedWords(newExpandedWords);
  };

  const formatExample = (sentence: string) => {
    const parts = sentence.split(/(\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <HighlightedWord key={index}>{part.slice(1, -1)}</HighlightedWord>
        );
      }
      return part;
    });
  };

  return (
    <ListContainer>
      <ListTitle>단어 목록</ListTitle>
      {words.map((word) => (
        <WordCard key={word.id}>
          <WordHeader onClick={() => toggleWord(word.id)}>
            <WordTitle>{word.word}</WordTitle>
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                onDeleteWord(word.id);
              }}
            >
              삭제
            </DeleteButton>
          </WordHeader>
          <ContentContainer isExpanded={expandedWords.has(word.id)}>
            <Section>
              <SectionTitle>의미</SectionTitle>
              <MeaningList>
                {word.meanings.map((meaning, index) => (
                  <MeaningItem key={meaning.id}>
                    <Number>{index + 1}.</Number>
                    <span>{meaning.definition}</span>
                  </MeaningItem>
                ))}
              </MeaningList>
            </Section>
            {word.examples.length > 0 && (
              <Section>
                <SectionTitle>예문</SectionTitle>
                <ExampleList>
                  {word.examples.map((example, index) => (
                    <ExampleItem key={example.id}>
                      <Number>{index + 1}.</Number>
                      <div>
                        <ExampleText>
                          {formatExample(example.sentence)}
                        </ExampleText>
                        <ExampleTranslation>
                          {example.translation}
                        </ExampleTranslation>
                      </div>
                    </ExampleItem>
                  ))}
                </ExampleList>
              </Section>
            )}
          </ContentContainer>
        </WordCard>
      ))}
    </ListContainer>
  );
};

export default WordList;
