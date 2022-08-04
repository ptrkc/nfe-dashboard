import Head from 'next/head';
import NextLink from 'next/link';
import { Flex, SimpleGrid } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import { FiPlus } from 'react-icons/fi';

import ReceiptsTable from 'components/ReceiptsTable';
import { formatLongDateBR } from 'lib/formatLongDateBR';
import formatBRL from 'lib/formatBRL';
import fetchData from 'lib/fetchData';

function ReceiptCard({ receipt }) {
  return (
    <NextLink href={`/notas/${receipt.id}`} passHref>
      <a className="rounded-frame p-2">
        <p className="text-sm">{receipt.market.name}</p>
        <p className="font-bold text-2xl">{formatBRL(receipt.total)}</p>
        <p className="text-sm text-gray-600">{formatLongDateBR(receipt.date)}</p>
      </a>
    </NextLink>
  );
}

function Receipts() {
  const { data: receipts = [], isLoading } = useQuery('/api/notas', () => fetchData('/api/notas'));
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Notas</title>
      </Head>
      <Flex direction="column" gap={2}>
        <Flex justifyContent="space-between" alignItems="center">
          <div>
            Filtros, data, mercado,...?
          </div>
          <NextLink href="/notas/new" passHref>
            <a className="btn btn-blue">
              <FiPlus />
              {' '}
              Nova Nota
            </a>
          </NextLink>
        </Flex>
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} gap={4}>
          {receipts.map((receipt) => <ReceiptCard receipt={receipt} key={receipt.id} />)}
        </SimpleGrid>
        <div className="rounded-frame">
          <ReceiptsTable isLoading={isLoading} receipts={receipts} />
        </div>
      </Flex>
    </>
  );
}

export default Receipts;
