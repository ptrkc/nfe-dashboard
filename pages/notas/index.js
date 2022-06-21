import { prisma } from 'lib/prisma'

import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Button, Box, Flex } from '@chakra-ui/react'
import { RoundedFrame } from 'components/RoundedFrame'
import { NotasTable } from 'components/NotasTable'

const Notas = ({ notas }) => (
  <>
    <Head>
      <title>NFe Dashboard | Notas</title>
    </Head>
    <Flex direction="column" gap="2">
      <Flex justifyContent="space-between" alignItems="center">
        <Box>
          Filtros, data, mercado,...?
        </Box>
        <NextLink href="/notas/new" passHref>
          <Button as={Link}>+ Nova Nota</Button>
        </NextLink>
      </Flex>
      <RoundedFrame>
        <NotasTable notas={notas} />
      </RoundedFrame>
    </Flex>
  </>
)

export const getServerSideProps = async () => {
  const notas = await prisma.nota.findMany({
    select: {
      id: true,
      date: true,
      total: true,
      market: {
        select: {
          name: true,
        },
      },
    },
  })

  return {
    props: { notas: JSON.parse(JSON.stringify(notas)) }, // will be passed to the page component as props
  }
}

export default Notas
