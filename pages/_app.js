import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'
import { theme } from 'lib/chakraTheme'
import { queryClient } from 'lib/queryClient'
import { Layout } from 'components/Layout'

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  </QueryClientProvider>
)

export default MyApp
