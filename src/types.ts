export interface Theme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryHover: string;
  error: string;
  errorHover: string;
  border: string;
}

export interface Meaning {
  id: string;
  definition: string;
}

export interface Example {
  id: string;
  sentence: string;
  translation: string;
}

export interface Word {
  id: string;
  word: string;
  meanings: Meaning[];
  examples: Example[];
}

export interface Quiz {
  id: string;
  type: "word-to-meaning" | "meaning-to-word";
  question: string;
  answer: string;
  options?: string[];
}

export interface StoredWords {
  words: Word[];
  lastUpdated: string;
}

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
