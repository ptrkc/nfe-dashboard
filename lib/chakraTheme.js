import { extendTheme } from '@chakra-ui/react'

const Button = {
  variants: {
    solid: props => ({
      _hover: {
        textDecoration: 'none',
      },
    }),
  },
  defaultProps: {
    colorScheme: 'blue', // default is gray
  },
}

const Table = {
  defaultProps: {
    size: 'sm', // default is gray
  },
}

export const theme = extendTheme({
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
