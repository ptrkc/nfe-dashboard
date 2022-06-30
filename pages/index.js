import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Button, Link, SimpleGrid, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { StatCard } from 'components/StatCard'
import { SlidingSegmentedControl } from 'components/SlidingSegmentedControl'

const Home = () => (
  <Box>
    <Head>
      <title>NFe Dashboard</title>
    </Head>
    <NextLink href="/notas/new" passHref>
      <Button as={Link} leftIcon={<AddIcon w={3} />}>Nova Nota</Button>
    </NextLink>
    <SimpleGrid columns={3} gap={2}>
      <StatCard>
        <StatLabel>Dinheiro Gasto</StatLabel>
        <StatNumber>R$0.00</StatNumber>
        <StatHelpText>01 Jun - 30 Jun</StatHelpText>
      </StatCard>
      <StatCard>
        <StatLabel>Dinheiro Gasto</StatLabel>
        <StatNumber>R$0.00</StatNumber>
        <StatHelpText>01 Jun - 30 Jun</StatHelpText>
      </StatCard>
      <StatCard>
        <StatLabel>Dinheiro Gasto</StatLabel>
        <StatNumber>R$0.00</StatNumber>
        <StatHelpText>01 Jun - 30 Jun</StatHelpText>
      </StatCard>
      <StatCard>
        <StatLabel>Dinheiro Gasto</StatLabel>
        <StatNumber>R$0.00</StatNumber>
        <StatHelpText>01 Jun - 30 Jun</StatHelpText>
      </StatCard>
    </SimpleGrid>
    <SlidingSegmentedControl options={['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'OUT', 'NOV', 'DEZ']} />
  </Box>
)

export default Home
