import { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Select, VStack } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border-black border">
        {Object.entries(payload[0].payload).map(([key, value]) => (
          <p key={key}>{`${key} : ${value}`}</p>
        ))}
      </div>
    );
  }

  return null;
}

function Home() {
  const [selectedMonth, setSelectedMonth] = useState((new Date()).getMonth());
  const startDate = `${YEAR}-${String(selectedMonth).padStart(2, 0)}-01`;
  const endDate = `${selectedMonth === 12 ? YEAR + 1 : YEAR}-${String(selectedMonth === 12 ? 1 : selectedMonth + 1).padStart(2, 0)}-01`;
  const endpoint = `/api/notas?startDate=${startDate}&endDate=${endDate}`;
  const isMd = useBreakpoint('md');
  const is2xl = useBreakpoint('2xl');

  const { data: receipts = [] } = useQuery(endpoint, () => fetchData(endpoint));

  return (
    <div className="h-96">
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
            onChange={(evt) => setSelectedMonth(parseInt(evt.target.value))}
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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={receipts.map((r) => ({ ...r, total: parseFloat(r.total), date: (new Date(r.date)).toLocaleDateString('pt-BR') }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="total" fill="#2563eb" label={{ position: 'top' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Home;
