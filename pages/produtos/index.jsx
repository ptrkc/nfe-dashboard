import prisma from 'lib/prisma';

import { useMemo } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useTable, useSortBy } from 'react-table';

function PurchasesTable({ purchases }) {
  const data = useMemo(() => purchases, [purchases]);

  const columns = useMemo(
    () => [
      { Header: 'id', accessor: 'id' },
      { Header: 'name', accessor: 'name' },
      { Header: 'ean', accessor: 'ean' },
    ],
    [],
  );
  const initialState = useMemo(() => ({ sortBy: ['name'] }), []);

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
                className={`${column.isNumeric ? 'text-right' : ''}`}
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
        {rows.map(({ original: { id, ean, name } }) => (
          <tr key={id}>
            <td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <a title={id}>{id}</a>
              </NextLink>
            </td>
            <td>
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <a>{name}</a>
              </NextLink>
            </td>
            <td className="text-right">
              <NextLink passHref href={`/produtos/${encodeURIComponent(ean)}`}>
                <a>{ean}</a>
              </NextLink>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Purchases({ purchases }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Produtos</title>
      </Head>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            Filtros..., adicionar mercado, editar
          </div>
        </div>
        <div className="rounded-frame">
          <PurchasesTable purchases={purchases} />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async () => {
  const purchases = await prisma.purchase.findMany({
    distinct: ['ean'],
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
      receiptId: true,
      marketId: true,
    },
  });

  return { props: { purchases: JSON.parse(JSON.stringify(purchases)) } };
};

export default Purchases;
