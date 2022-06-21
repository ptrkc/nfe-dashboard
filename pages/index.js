import Head from 'next/head'
import { Box, HStack, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import { RoundedFrame } from 'components/RoundedFrame'

const StatCard = () => (
  <RoundedFrame pt={2} px={2} bg="blackAlpha.700">
    <Stat>
      <StatLabel>Dinheiro Gasto</StatLabel>
      <StatNumber>R$0.00</StatNumber>
      <StatHelpText>01 Jun - 30 Jun</StatHelpText>
    </Stat>
  </RoundedFrame>
)

const Home = () => (
  <Box>
    <Head>
      <title>NFe Dashboard</title>
    </Head>
    <HStack gap="2">
      <StatCard /><StatCard /><StatCard />
    </HStack>
  </Box>
)

export default Home
