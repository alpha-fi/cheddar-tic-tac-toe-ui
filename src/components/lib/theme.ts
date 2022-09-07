import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: () => ({
    body: {
      bgColor: colors.greenCheddar,
    },
  }),
};

const components = {
  Heading: {
    baseStyle: () => ({
      color: colors.textCheddar,
    }),
  },
  Text: {
    baseStyle: () => ({
      textAlign: "left",
      color: colors.textCheddar,
    }),
  },
  Link: {
    baseStyle: () => ({
      color: colors.textCheddar,
      textUnderlineOffset: 3,
    }),
  },
};

const fonts = {
  heading: `'Titillium Web', sans-serif`,
  body: `'Titillium Web', sans-serif`,
};

const colors = {
  greenCheddar: "#5e8c01",
  yellowCheddar: "#ffd262",
  purpleCheddar: "#8542eb",
  textCheddar: "#333",
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles,
  components,
  fonts,
  colors,
});
