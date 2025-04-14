import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    error: string;
    errorHover: string;
    border: string;
  }
}

export interface Word {
  id: string;
  word: string;
  meanings: Meaning[];
  examples: Example[];
}

export interface Meaning {
  id: string;
  definition: string;
}

export interface Example {
  id: string;
  sentence: string;
  translation: string;
  highlightedWord: string;
}

export interface StoredWords {
  words: Word[];
}

export interface Quiz {
  id: string;
  type: "word-to-meaning" | "meaning-to-word" | "example";
  question: string;
  answer: string;
  options: string[];
  translation?: string;
}
