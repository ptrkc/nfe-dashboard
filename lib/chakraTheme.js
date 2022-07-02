import { extendTheme } from '@chakra-ui/react'

const Button = {
  baseStyle: {
    transition: '.2s',
    _hover: {
      textDecoration: 'none',
    },
  },
  defaultProps: {
    colorScheme: 'blue',
  },
}

const Table = {
  defaultProps: {
    size: 'sm',
    variant: 'striped',
  },
  variants: {
    striped: () => ({
      th: {
        borderBottom: '0px',
      },
      td: {
        borderBottom: '0px',
      },
    }),
  },

}

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: {
      '*': {
        boxSizing: 'border-box',
      },
      body: {
        bg: 'gray.50',
        fontFamily: "-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto",
      },
    },
  },
  components: {
    Button,
    Table,
  },
})
