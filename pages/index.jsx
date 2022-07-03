import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box, Button, Link, Select, SimpleGrid, StatHelpText, StatLabel, StatNumber, useBreakpointValue,
  VStack,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import StatCard from 'components/StatCard';
import SlidingSegmentedControl from 'components/SlidingSegmentedControl';
import { useState } from 'react';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
  'Outubro', 'Novembro', 'Dezembro',
];

const longMonthOptions = months.map((month, index) => ({ value: index, label: month }));
const shortMonthOptions = months.map((month, index) => (
  { value: index, label: month.substring(0, 3) }
));

function Home() {
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
  const isDesktop = useBreakpointValue({ base: false, md: true });
  return (
    <Box>
      <Head>
        <title>💸 NFe Dashboard</title>
      </Head>
      <VStack alignItems="flex-start">
        <NextLink href="/notas/new" passHref>
          <Button as={Link} leftIcon={<AddIcon w={3} />}>Nova Nota</Button>
        </NextLink>
        {isDesktop ? (
          <SlidingSegmentedControl
            options={shortMonthOptions}
            selectedValue={selectedMonth}
            setSelectedValue={setSelectedMonth}
          />
        )
          : (
            <Select
              bg="white"
              name="market"
              id="market"
              value={selectedMonth}
              onChange={(evt) => setSelectedMonth(evt.target.value)}
            >
              {longMonthOptions.map(({ label, value }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          )}
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
  );
}

export default Home;
