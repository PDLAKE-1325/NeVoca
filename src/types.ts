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
  wordPosition: number;
  wordLength: number;
}

export interface Word {
  id: string;
  word: string;
  meanings: Meaning[];
  examples: Example[];
}

export interface Quiz {
  id: string;
  type: "word-to-meaning" | "meaning-to-word" | "fill-in-blank";
  question: string;
  answer: string;
  options?: string[];
  exampleWordPosition?: number;
  exampleWordLength?: number;
}

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
