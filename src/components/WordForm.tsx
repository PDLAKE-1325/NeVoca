import React, { useState } from "react";
import styled from "styled-components";
import { Word, Meaning, Example } from "../types";
import { v4 as uuidv4 } from "uuid";

const FormContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  background-color: ${(props) => props.theme.surface};
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${(props) => props.theme.text};
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const AddButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const SubmitButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: ${(props) => props.theme.background};
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const RemoveButton = styled.button`
  background-color: ${(props) => props.theme.error};
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.errorHover};
  }
`;

const ExampleInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  width: 100%;
  overflow-x: hidden;
`;

const ExampleInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const ExampleTranslationInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${(props) => props.theme.border};
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.primary};
  }
`;

const AddExampleButton = styled.button`
  background-color: ${(props) => props.theme.primary};
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.primaryHover};
  }
`;

const HelpText = styled.p`
  color: ${(props) => props.theme.textSecondary};
  font-size: 0.8rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
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
        { id: uuidv4(), definition: newMeaning.trim() },
      ]);
      setNewMeaning("");
    }
  };

  const handleRemoveMeaning = (id: string) => {
    setMeanings(meanings.filter((meaning) => meaning.id !== id));
  };

  const handleAddExample = () => {
    if (newExample.trim() && newExampleTranslation.trim()) {
      setExamples([
        ...examples,
        {
          id: uuidv4(),
          sentence: newExample.trim(),
          translation: newExampleTranslation.trim(),
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
          <Label htmlFor="word">단어</Label>
          <Input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>의미</Label>
          <div>
            <Input
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              placeholder="새로운 의미를 입력하세요"
            />
            <AddButton type="button" onClick={handleAddMeaning}>
              의미 추가
            </AddButton>
          </div>
          <List>
            {meanings.map((meaning) => (
              <ListItem key={meaning.id}>
                <span>{meaning.definition}</span>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveMeaning(meaning.id)}
                >
                  삭제
                </RemoveButton>
              </ListItem>
            ))}
          </List>
        </FormGroup>

        <FormGroup>
          <Label>예문</Label>
          <ExampleInput
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            placeholder="예문을 입력하세요 (*단어* 형식으로 강조할 단어를 표시)"
          />
          <ExampleTranslationInput
            value={newExampleTranslation}
            onChange={(e) => setNewExampleTranslation(e.target.value)}
            placeholder="예문 번역"
          />
          <AddExampleButton type="button" onClick={handleAddExample}>
            예문 추가
          </AddExampleButton>

          <HelpText>
            예문에서 강조할 단어는 *단어* 형식으로 입력하세요. 예: I love
            *reading* books.
          </HelpText>
          <List>
            {examples.map((example) => (
              <ListItem key={example.id}>
                <div>
                  <div>{example.sentence}</div>
                  <div style={{ color: "#b3b3b3", fontStyle: "italic" }}>
                    {example.translation}
                  </div>
                </div>
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveExample(example.id)}
                >
                  삭제
                </RemoveButton>
              </ListItem>
            ))}
          </List>
        </FormGroup>

        <SubmitButton type="submit">단어 추가</SubmitButton>
      </form>
    </FormContainer>
  );
};

export default WordForm;
