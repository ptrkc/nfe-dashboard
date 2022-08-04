import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Select, VStack } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FiPlus } from 'react-icons/fi';

import SlidingSegmentedControl from 'components/SlidingSegmentedControl';
import useBreakpoint from 'hooks/useBreakpoint';
import fetchData from 'lib/fetchData';

const YEAR = 2022;

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
  'Outubro', 'Novembro', 'Dezembro',
];

const longMonthOptions = months.map((month, index) => ({ value: index + 1, label: month }));
const shortMonthOptions = months.map((month, index) => (
  { value: index + 1, label: month.substring(0, 3) }
));

const sumTotalReducer = (prev, current) => prev + parseFloat(current.total);

function Home() {
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
  const startDate = `${YEAR}-${String(selectedMonth).padStart(2, 0)}-01`;
  const endDate = `${selectedMonth === 12 ? YEAR + 1 : YEAR}-${String(selectedMonth === 12 ? 1 : selectedMonth + 1).padStart(2, 0)}-01`;
  const endpoint = `/api/notas?startDate=${startDate}&endDate=${endDate}`;
  const isMd = useBreakpoint('md');
  const is2xl = useBreakpoint('2xl');

  const { data: receipts = [], isLoading } = useQuery(endpoint, () => fetchData(endpoint));

  console.log(receipts);

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
            <p className="text-sm">Compras no Mês</p>
            <p className="font-bold text-2xl">{receipts.length}</p>
            <p className="text-sm text-gray-600">
              Mês
              {' '}
              {selectedMonth}
            </p>
          </div>
          <div className="rounded-frame p-2">
            <p className="text-sm">Dinheiro Gasto</p>
            <p className="font-bold text-2xl">
              R$
              {receipts.reduce(sumTotalReducer, 0).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              Mês
              {' '}
              {selectedMonth}
            </p>
          </div>
        </div>
      </VStack>
    </div>
  );
}

export default Home;
