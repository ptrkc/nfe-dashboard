import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Select, VStack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

import SlidingSegmentedControl from 'components/SlidingSegmentedControl';
import useBreakpoint from 'hooks/useBreakpoint';

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
  const isMd = useBreakpoint('md');
  const is2xl = useBreakpoint('2xl');

  return (
    <div>
      <Head>
        <title>💸 NFe Dashboard</title>
      </Head>
      <VStack alignItems="flex-start">
        <NextLink href="/notas/new" passHref>
          <a className="btn btn-blue">
            <FiPlus />
            Nova Nota
          </a>
        </NextLink>
        {isMd ? (
          <SlidingSegmentedControl
            options={is2xl ? longMonthOptions : shortMonthOptions}
            selectedValue={selectedMonth}
            setSelectedValue={setSelectedMonth}
          />
        ) : (
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
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-frame p-2">
            <p className="text-sm">Dinheiro Gasto</p>
            <p className="font-bold text-2xl">R$0.00</p>
            <p className="text-sm text-gray-600">01 Jun - 30 Jun</p>
          </div>
          <div className="rounded-frame p-2">
            <p className="text-sm">Dinheiro Gasto</p>
            <p className="font-bold text-2xl">R$0.00</p>
            <p className="text-sm text-gray-600">01 Jun - 30 Jun</p>
          </div>
          <div className="rounded-frame p-2">
            <p className="text-sm">Dinheiro Gasto</p>
            <p className="font-bold text-2xl">R$0.00</p>
            <p className="text-sm text-gray-600">01 Jun - 30 Jun</p>
          </div>
          <div className="rounded-frame p-2">
            <p className="text-sm">Dinheiro Gasto</p>
            <p className="font-bold text-2xl">R$0.00</p>
            <p className="text-sm text-gray-600">01 Jun - 30 Jun</p>
          </div>
        </div>
      </VStack>
    </div>
  );
}

export default Home;
