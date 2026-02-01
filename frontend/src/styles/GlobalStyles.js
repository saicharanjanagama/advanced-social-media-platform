import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  background: #f8fafc;
  color: #020617;
  -webkit-tap-highlight-color: transparent;
}

button {
  cursor: pointer;
  font-family: inherit;
  touch-action: manipulation;
}


  input, textarea {
    font-family: inherit;
    outline: none;
  }
`;

export default GlobalStyles;
