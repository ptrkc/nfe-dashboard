import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Link } from '@chakra-ui/react'

export default function Home() {
  return (
    <Box>
      <Head>
        <title>NFe Dashboard</title>
      </Head>
      <NextLink href="/notas" passHref>
        <Link>notas</Link>
      </NextLink>
    </Box>
  )
}
