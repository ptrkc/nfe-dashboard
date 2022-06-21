import { extendTheme } from '@chakra-ui/react'

const Button = {
  variants: {
    solid: props => ({
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
    striped: props => ({
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
    },
  },
  components: {
    Button,
    Table,
  },
})
