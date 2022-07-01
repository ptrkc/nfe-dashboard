import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Button, Flex, Link, SimpleGrid, StatHelpText, StatLabel, StatNumber, VStack } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { StatCard } from 'components/StatCard'
import { SlidingSegmentedControl } from 'components/SlidingSegmentedControl'
import { useState } from 'react'

const monthOptions = [
  { label: 'JAN', value: 0 },
  { label: 'FEV', value: 1 },
  { label: 'MAR', value: 2 },
  { label: 'ABR', value: 3 },
  { label: 'MAI', value: 4 },
  { label: 'JUN', value: 5 },
  { label: 'JUL', value: 6 },
  { label: 'AGO', value: 7 },
  { label: 'SET', value: 8 },
  { label: 'OUT', value: 9 },
  { label: 'NOV', value: 10 },
  { label: 'DEZ', value: 11 },
]

const Home = () => {
  const [selectedValue, setSelectedValue] = useState((new Date()).getMonth())
  return (
    <Box>
      <Head>
        <title>💸NFe Dashboard</title>
      </Head>
      <VStack alignItems="flex-start">
        <NextLink href="/notas/new" passHref>
          <Button as={Link} leftIcon={<AddIcon w={3} />}>Nova Nota</Button>
        </NextLink>
        <SlidingSegmentedControl
          options={monthOptions}
          selectedValue={selectedValue}
          setSelectedValue={setSelectedValue}
        />
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={4} w="full">
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
      </VStack>
    </Box>
  )
}

export default Home
