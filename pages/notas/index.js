import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Button, Box, Flex } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { RoundedFrame } from 'components/RoundedFrame'
import { ReceiptsTable } from 'components/ReceiptsTable'
import { useQuery } from 'react-query'

const Notas = () => {
  const { data: receipts = [], isLoading } = useQuery('/api/notas', () => fetch('/api/notas').then(res => res.json()))
  return (
    <>
      <Head>
        <title>NFe Dashboard | Notas</title>
      </Head>
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <Box>
            Filtros, data, mercado,...?
          </Box>
          <NextLink href="/notas/new" passHref>
            <Button as={Link} leftIcon={<AddIcon w={3} />}>Nova Nota</Button>
          </NextLink>
        </Flex>
        <RoundedFrame>
          <ReceiptsTable isLoading={isLoading} receipts={receipts} />
        </RoundedFrame>
      </Flex>
    </>
  )
}

export default Notas
