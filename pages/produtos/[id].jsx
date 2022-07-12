import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Link, Table, Thead, Tbody, Td, Tr, Th } from '@chakra-ui/react';
import { useTable, useSortBy } from 'react-table';

import formatBRL from 'lib/formatBRL';
import dateSlice from 'lib/dateSlice';

function ProductPurchasesTable({ purchases }) {
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
      { Header: 'Data', accessor: 'receipt.date' },
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
                <Link>{row.name}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{dateSlice(row.receipt.date)}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{row.quantity}</Link>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href="/">
                <Link>{row.unit}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{formatBRL(row.unitPrice)}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{formatBRL(row.regularPrice)}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{formatBRL(row.discount)}</Link>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href="/">
                <Link>{formatBRL(row.chargedPrice)}</Link>
              </NextLink>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={4} />
          <td className="text-right">
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.unitPrice)}</Link>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.regularPrice)}</Link>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.discount)}</Link>
            </NextLink>
          </td>
          <td className="text-right">
            <NextLink passHref href="/">
              <Link>{formatBRL(totals.chargedPrice)}</Link>
            </NextLink>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ProductPage({ purchases }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Produto</title>
      </Head>
      <div className="rounded-frame">
        <ProductPurchasesTable purchases={purchases} />
      </div>
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
  const purchases = await prisma.purchase.findMany({
    where: { ean: id },
    select: {
      id: true,
      name: true,
      quantity: true,
      unit: true,
      unitPrice: true,
      regularPrice: true,
      discount: true,
      chargedPrice: true,
      receiptId: true,
      marketId: true,
      receipt: { select: { date: true } },
    },
  });

  return { props: { purchases: JSON.parse(JSON.stringify(purchases)) } };
};

export default ProductPage;
