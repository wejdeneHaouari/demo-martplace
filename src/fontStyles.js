import { createGlobalStyle } from "styled-components";
import AileronReguler from "../src/assets/fonts/aileron/Aileron-Regular.otf";
import AileronBold from "../src/assets/fonts/aileron/Aileron-Bold.otf";

const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'Aileron Reguler';
  src: url(${AileronReguler})
}

@font-face {
  font-family: 'Aileron Bold';
  src: url(${AileronBold})
}
`;

export default FontStyles;
