import { ChakraProvider } from '@chakra-ui/react'
import { theme } from 'lib/chakraTheme'
import { Layout } from 'components/Layout'

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
)

export default MyApp
