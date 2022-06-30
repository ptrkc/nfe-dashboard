import Head from 'next/head'
import NextLink from 'next/link'
import { Link, Button, Box, Flex, SimpleGrid, StatLabel, StatNumber, StatHelpText, LinkBox, LinkOverlay } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { StatCard } from 'components/StatCard'
import { ReceiptsTable } from 'components/ReceiptsTable'
import { useQuery } from 'react-query'
import { formatLongDateBR } from 'lib/formatLongDateBR'
import { formatBRL } from 'lib/formatBRL'
import { RoundedFrame } from 'components/RoundedFrame'

const ReceiptCard = ({ receipt }) => (
  <LinkBox>
    <NextLink href={`/notas/${receipt.id}`} passHref>
      <LinkOverlay>
        <StatCard>
          <StatLabel>{receipt.market.name}</StatLabel>
          <StatNumber>{formatBRL(receipt.total)}</StatNumber>
          <StatHelpText>{formatLongDateBR(receipt.date)}</StatHelpText>
        </StatCard>
      </LinkOverlay>
    </NextLink>
  </LinkBox>
)

const Receipts = () => {
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
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
          {receipts.map(receipt => <ReceiptCard receipt={receipt} key={receipt.id} />)}
        </SimpleGrid>
        <RoundedFrame>
          <ReceiptsTable isLoading={isLoading} receipts={receipts} />
        </RoundedFrame>
      </Flex>
    </>
  )
}

export default Receipts
