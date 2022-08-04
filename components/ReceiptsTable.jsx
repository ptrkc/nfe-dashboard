import { useMemo } from 'react';
import NextLink from 'next/link';
import { Skeleton } from '@chakra-ui/react';
import { useSortBy, useTable } from 'react-table';
import formatBRL from 'lib/formatBRL';
import { formatLongDateBR } from 'lib/formatLongDateBR';
import dateSlice from 'lib/dateSlice';

function parseAndSumReducer(previousValue, currentValue) {
  return previousValue + parseFloat(currentValue.total); // TODO: check if I need parseFloat
}

export default function ReceiptsTable({ receipts, isLoading }) {
  const data = useMemo(() => receipts, [receipts]);
  const totalSum = useMemo(
    () => receipts.reduce(parseAndSumReducer, 0),
    [receipts],
  );
  const columns = useMemo(
    () => [
      { Header: 'Mercado', accessor: 'market.name' },
      { Header: 'Data', accessor: 'date' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
    ],
    [],
  );
  const initialState = useMemo(() => ({ sortBy: [{ id: 'date', desc: false }] }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy);

  // if (isLoading) return (<Skeleton> lol</Skeleton>)

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
        {isLoading
          ? [...Array(5).keys()].map((key) => (
            <tr key={key}>
              <td colSpan={columns.length}>
                <Skeleton w="100%">
                  {key}
                </Skeleton>
              </td>
            </tr>
          ))
          : rows.map(({ original: { id, market, date, total } }) => {
            const marketName = market.nickname || market.name;
            return (
              <tr key={id}>
                <td>
                  <NextLink passHref href={`/notas/${id}`}>
                    <a>{marketName}</a>
                  </NextLink>
                </td>
                <td className="text-right">
                  <NextLink passHref href={`/notas/${id}`}>
                    <a title={formatLongDateBR(date)}>{dateSlice(date)}</a>
                  </NextLink>
                </td>
                <td className="text-right">
                  <NextLink passHref href={`/notas/${id}`}>
                    <a>{formatBRL(total)}</a>
                  </NextLink>
                </td>
              </tr>
            );
          })}
        <tr>
          <td colSpan={2} />
          <td className="text-right">
            <NextLink passHref href="/">
              <a>{formatBRL(totalSum)}</a>
            </NextLink>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
