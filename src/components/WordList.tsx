import React from "react";
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

const WordTitle = styled.h3`
  color: ${(props) => props.theme.text};
  margin-bottom: 10px;
`;

const MeaningList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
`;

const MeaningItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.surface};
  border-radius: 4px;
  color: ${(props) => props.theme.text};
`;

const ExampleList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ExampleItem = styled.li`
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${(props) => props.theme.surface};
  border-radius: 4px;
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

interface WordListProps {
  words: Word[];
}

const WordList: React.FC<WordListProps> = ({ words }) => {
  return (
    <ListContainer>
      <ListTitle>단어 목록</ListTitle>
      {words.map((word) => (
        <WordCard key={word.id}>
          <WordTitle>{word.word}</WordTitle>
          <MeaningList>
            {word.meanings.map((meaning) => (
              <MeaningItem key={meaning.id}>{meaning.definition}</MeaningItem>
            ))}
          </MeaningList>
          {word.examples.length > 0 && (
            <ExampleList>
              {word.examples.map((example) => (
                <ExampleItem key={example.id}>
                  <ExampleText>
                    {example.sentence.slice(0, example.wordPosition)}
                    <span style={{ borderBottom: "2px solid #4CAF50" }}>
                      {example.sentence.slice(
                        example.wordPosition,
                        example.wordPosition + example.wordLength
                      )}
                    </span>
                    {example.sentence.slice(
                      example.wordPosition + example.wordLength
                    )}
                  </ExampleText>
                  <ExampleTranslation>{example.translation}</ExampleTranslation>
                </ExampleItem>
              ))}
            </ExampleList>
          )}
        </WordCard>
      ))}
    </ListContainer>
  );
};

export default WordList;
