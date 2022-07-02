import { ChakraProvider } from '@chakra-ui/react'
import { QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { theme } from 'lib/chakraTheme'
import { queryClient } from 'lib/queryClient'
import { Layout } from 'components/Layout'

const MyApp = ({ Component, pageProps }) => (
  <QueryClientProvider client={queryClient} resetCSS>
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
  </QueryClientProvider>
)

export default MyApp
