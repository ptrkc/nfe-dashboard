import { ChakraProvider } from '@chakra-ui/react'
import { Layout } from 'components/Layout'
import { theme } from 'lib/chakraTheme'

const MyApp = ({ Component, pageProps }) => (
  <ChakraProvider theme={theme}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </ChakraProvider>
)

export default MyApp
