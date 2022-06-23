import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Button, HStack, Link, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import { RoundedFrame } from 'components/RoundedFrame'
import { AddIcon } from '@chakra-ui/icons'

const StatCard = () => (
  <RoundedFrame pt={2} px={2} bg="gray.900">
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
    <NextLink href="/notas/new" passHref>
      <Button as={Link} leftIcon={<AddIcon w={3} />}>Nova Nota</Button>
    </NextLink>
    <HStack gap={2}>
      <StatCard />
      <StatCard />
      <StatCard />
    </HStack>
  </Box>
)

export default Home
