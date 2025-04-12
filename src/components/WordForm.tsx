import React, { useState } from "react";
import styled from "styled-components";
import { Word, Meaning, Example } from "../types";
import { v4 as uuidv4 } from "uuid";

const FormContainer = styled.div`
  background-color: ${(props) => props.theme.surface};
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const FormTitle = styled.h2`
  margin-bottom: 20px;
  color: ${(props) => props.theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${(props) => props.theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 16px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const ListContainer = styled.div`
  margin-top: 10px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: ${(props) => props.theme.background};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 4px;
  margin-bottom: 10px;
`;

const ListItemText = styled.span`
  color: ${(props) => props.theme.text};
`;

const RemoveButton = styled.button`
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

const AddButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const ExampleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
`;

interface WordFormProps {
  onAddWord: (word: Word) => void;
}

const WordForm: React.FC<WordFormProps> = ({ onAddWord }) => {
  const [word, setWord] = useState("");
  const [meanings, setMeanings] = useState<Meaning[]>([]);
  const [newMeaning, setNewMeaning] = useState("");
  const [examples, setExamples] = useState<Example[]>([]);
  const [newExample, setNewExample] = useState("");
  const [newExampleTranslation, setNewExampleTranslation] = useState("");

  const handleAddMeaning = () => {
    if (newMeaning.trim()) {
      setMeanings([
        ...meanings,
        {
          id: uuidv4(),
          definition: newMeaning.trim(),
        },
      ]);
      setNewMeaning("");
    }
  };

  const handleRemoveMeaning = (id: string) => {
    setMeanings(meanings.filter((meaning) => meaning.id !== id));
  };

  const handleAddExample = () => {
    if (newExample.trim() && newExampleTranslation.trim()) {
      const wordPosition = newExample.indexOf(word);
      if (wordPosition === -1) {
        alert("예문에 단어가 포함되어 있지 않습니다.");
        return;
      }

      setExamples([
        ...examples,
        {
          id: uuidv4(),
          sentence: newExample.trim(),
          translation: newExampleTranslation.trim(),
          wordPosition,
          wordLength: word.length,
        },
      ]);
      setNewExample("");
      setNewExampleTranslation("");
    }
  };

  const handleRemoveExample = (id: string) => {
    setExamples(examples.filter((example) => example.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.trim() && meanings.length > 0) {
      onAddWord({
        id: uuidv4(),
        word: word.trim(),
        meanings,
        examples,
      });
      setWord("");
      setMeanings([]);
      setExamples([]);
    }
  };

  return (
    <FormContainer>
      <FormTitle>새 단어 추가</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>단어</Label>
          <Input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="영어 단어를 입력하세요"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>의미</Label>
          <div>
            <Input
              type="text"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              placeholder="단어의 의미를 입력하세요"
            />
            <AddButton type="button" onClick={handleAddMeaning}>
              의미 추가
            </AddButton>
          </div>
          <ListContainer>
            {meanings.map((meaning) => (
              <ListItem key={meaning.id}>
                <ListItemText>{meaning.definition}</ListItemText>
                <RemoveButton onClick={() => handleRemoveMeaning(meaning.id)}>
                  삭제
                </RemoveButton>
              </ListItem>
            ))}
          </ListContainer>
        </FormGroup>

        <FormGroup>
          <Label>예문</Label>
          <ExampleInputContainer>
            <TextArea
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              placeholder="예문을 입력하세요 (단어는 자동으로 강조됩니다)"
            />
            <Input
              type="text"
              value={newExampleTranslation}
              onChange={(e) => setNewExampleTranslation(e.target.value)}
              placeholder="예문의 번역을 입력하세요"
            />
            <AddButton type="button" onClick={handleAddExample}>
              예문 추가
            </AddButton>
          </ExampleInputContainer>
          <ListContainer>
            {examples.map((example) => (
              <ListItem key={example.id}>
                <div>
                  <ListItemText>
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
                  </ListItemText>
                  <ListItemText style={{ color: "#b3b3b3" }}>
                    {example.translation}
                  </ListItemText>
                </div>
                <RemoveButton onClick={() => handleRemoveExample(example.id)}>
                  삭제
                </RemoveButton>
              </ListItem>
            ))}
          </ListContainer>
        </FormGroup>

        <SubmitButton type="submit">단어 추가</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default WordForm;
