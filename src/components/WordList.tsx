import React, { useState } from "react";
import styled from "styled-components";
import { Word } from "../types";

const ListContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
`;

const ListTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

const WordCard = styled.div`
  background-color: ${(props) => props.theme.surface};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
`;

const WordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background-color: ${(props) => props.theme.surface};
  border-bottom: 1px solid ${(props) => props.theme.border};
`;

const WordTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${(props) => props.theme.text};
`;

const DeleteButton = styled.button`
  background-color: ${(props) => props.theme.error};
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.errorHover};
  }
`;

const ContentContainer = styled.div<{ isExpanded: boolean }>`
  max-height: ${(props) => (props.isExpanded ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  padding: ${(props) => (props.isExpanded ? "1rem" : "0")};
  width: 100%;
  box-sizing: border-box;
`;

const Section = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  color: ${(props) => props.theme.textSecondary};
`;

const MeaningList = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
`;

const MeaningItem = styled.li`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${(props) => props.theme.text};
`;

const ExampleList = styled.ul`
  padding-left: 1rem;
  margin: 0;
`;

const ExampleItem = styled.li`
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
`;

const ExampleText = styled.p`
  margin: 0 0 0.25rem 0;
  color: ${(props) => props.theme.text};
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const ExampleTranslation = styled.p`
  margin: 0;
  color: ${(props) => props.theme.textSecondary};
  font-style: italic;
  font-size: 0.8rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
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
                    {meaning.definition}
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
