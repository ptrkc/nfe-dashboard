import { extendTheme } from '@chakra-ui/react'

const Button = {
  variants: {
    solid: () => ({
      _hover: {
        textDecoration: 'none',
      },
    }),
  },
}

const Table = {
  defaultProps: {
    size: 'sm',
    variant: 'striped',
  },
  variants: {
    striped: () => ({
      thead: {
        bg: 'blackAlpha.700',
      },
      th: {
        borderBottom: '0px',
      },
      td: {
        borderBottom: '0px',
      },
    }),
  },
  baseStyle: {
    table: {
      borderRadius: '10',
    },
  },
}

export const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      '*': {
        boxSizing: 'border-box',
      },
      body: {
        bg: '#1c2128',
      },
    },
  },
  components: {
    Button,
    Table,
  },
  colors: {
    gray: {
      50: '#F0F2F4',
      100: '#D6DAE1',
      200: '#BCC3CD',
      300: '#A1ABBA',
      400: '#8794A6',
      500: '#6C7C93',
      600: '#576375',
      700: '#414B58',
      800: '#2B323B',
      900: '#16191D',
    },
  },
})
