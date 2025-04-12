import React from "react";
import ReactDOM from "react-dom/client";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import App from "./App";
import { Theme } from "./types";
import * as serviceWorker from "./serviceWorker";

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

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${(props) => props.theme.background};
    color: ${(props) => props.theme.text};
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// PWA 서비스 워커 등록
serviceWorker.register();
