import { extendTheme } from '@chakra-ui/react';

const Button = {
  baseStyle: {
    transition: '.2s',
    _hover: { textDecoration: 'none' },
  },
  defaultProps: { colorScheme: 'blue' },
};

const theme = extendTheme({ components: { Button } });

export default theme;
