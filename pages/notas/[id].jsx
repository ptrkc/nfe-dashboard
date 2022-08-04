import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Flex, VStack } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

import formatBRL from 'lib/formatBRL';
import { formatLongDateBR, formatTimeBR } from 'lib/formatLongDateBR';
import MarketTable from 'components/MarketTable';
import DeleteConfirmation from 'components/DeleteConfirmation';

function ReceiptStatCard({ receipt: { id, date, total, qrCode, market: { name, nickname } } }) {
  return (
    <div className="rounded-frame p-2">
      <p className="text-sm">{nickname || name}</p>
      <p className="font-bold text-2xl">{formatBRL(total)}</p>
      <p className="text-sm">{`${formatLongDateBR(date)}, ${formatTimeBR(date)}`}</p>
      <p className="text-sm text-gray-600">
        <a href={qrCode} target="_blank" rel="noopener noreferrer">{id}</a>
      </p>
    </div>
  );
}

function PurchasesTable({ purchases }) {
  const data = useMemo(() => purchases, [purchases]);
  const totals = useMemo(() => purchases.reduce(
    (previousValue, currentValue) => {
      const { unitPrice, regularPrice, discount, chargedPrice } = previousValue;
      return {
        unitPrice: unitPrice + (parseFloat(currentValue.unitPrice) || 0),
        regularPrice: regularPrice + (parseFloat(currentValue.regularPrice) || 0),
        discount: discount + (parseFloat(currentValue.discount) || 0),
        chargedPrice: chargedPrice + (parseFloat(currentValue.chargedPrice) || 0),
      };
    },
    { unitPrice: 0, regularPrice: 0, discount: 0, chargedPrice: 0 },
  ), [purchases]);
  const columns = useMemo(
    () => [
      { Header: 'Nome', accessor: 'name' },
      { Header: 'EAN', accessor: 'ean', disableSortBy: true },
      { Header: 'Quantidade', accessor: 'quantity' },
      { Header: 'UN', accessor: 'unit', disableSortBy: true },
      { Header: 'Preço Un', accessor: 'unitPrice', disableSortBy: true },
      { Header: 'Preço', accessor: 'regularPrice', disableSortBy: true },
      { Header: 'Desconto', accessor: 'discount' },
      { Header: 'Total', accessor: 'chargedPrice' },
    ],
    [],
  );
  const initialState = useMemo(() => ({ sortBy: [{ id: 'chargedPrice', desc: true }] }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // eslint-disable-next-line react/jsx-key
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {/* eslint-disable-next-line no-nested-ternary */}
                  {column.canSort && (column.isSorted
                    ? column.isSortedDesc
                      ? ' ↑'
                      : ' ↓'
                    : ' ↕')}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(({ original: row }) => (
          <tr key={row.id}>
            <td>
              <NextLink passHref href="/">
                <a>{row.name}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href={`/produtos/${row.ean}`}>
                <a>{row.ean}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <a>{row.quantity}</a>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href="/">
                <a>{row.unit}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <a>{formatBRL(row.unitPrice)}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <a>{formatBRL(row.regularPrice)}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <a>{formatBRL(row.discount)}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <a>{formatBRL(row.chargedPrice)}</a>
              </NextLink>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={4} />
          <td className="text-right">
            <NextLink passHref href="/">
              <a>{formatBRL(totals.unitPrice)}</a>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <a>{formatBRL(totals.regularPrice)}</a>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <a>{formatBRL(totals.discount)}</a>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <a>{formatBRL(totals.chargedPrice)}</a>
            </NextLink>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function Receipt({ receipt }) {
  const { purchases, market } = receipt;
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Nota</title>
      </Head>
      <VStack gap="2" alignItems="flex-start">
        <Flex direction={{ base: 'column', lg: 'row' }} gap={2}>
          <div>
            <ReceiptStatCard receipt={receipt} />
          </div>
          <div>
            <div className="rounded-frame">
              <MarketTable market={market} />
            </div>
          </div>
        </Flex>
        <div className="rounded-frame">
          <PurchasesTable purchases={purchases} />
        </div>
        <DeleteConfirmation
          reqUrl={`/api/notas/${receipt.id}`}
          redirectUrl="/notas"
          header="Deletar Nota"
          body="Tem certeza que deseja excluir essa nota?"
        />
      </VStack>
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const receipt = await prisma.receipt.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      total: true,
      filteredTotal: true,
      qrCode: true,
      market: {
        select: {
          id: true,
          name: true,
          fantasia: true,
          cnpj: true,
          address: true,
          cep: true,
          nickname: true,
        },
      },
      purchases: {
        select: {
          id: true,
          name: true,
          ean: true,
          quantity: true,
          unit: true,
          unitPrice: true,
          regularPrice: true,
          discount: true,
          chargedPrice: true,
          ignore: true,
        },
      },
    },
  });

  return { props: { receipt: JSON.parse(JSON.stringify(receipt)) } };
};

export default Receipt;
