import { extendTheme } from '@chakra-ui/react';

const Button = {
  baseStyle: {
    transition: '.2s',
    _hover: { textDecoration: 'none' },
  },
  defaultProps: { colorScheme: 'blue' },
};

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      '*': { boxSizing: 'border-box' },
      body: {
        bg: 'gray.50',
        fontFamily: "-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto",
      },
    },
  },
  components: { Button },
});

export default theme;
