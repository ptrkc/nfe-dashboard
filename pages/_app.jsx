import { QueryClientProvider } from 'react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'styles/globals.css';
import theme from 'lib/chakraTheme';
import { queryClient } from 'lib/queryClient';
import Layout from 'components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient} resetCSS>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
    </QueryClientProvider>
  );
}

export default MyApp;
