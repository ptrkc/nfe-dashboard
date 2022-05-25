import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTable, useSortBy } from 'react-table'
import { prisma } from 'lib/prisma'
import { formatBRL } from 'lib/formatBRL'

const PurchasesTable = ({ purchases }) => {
  const data = useMemo(() => purchases, [purchases])
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
  )
  const initialState = useMemo(() => ({ sortBy: [{ id: 'chargedPrice', desc: true }] }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({ columns, data, initialState }, useSortBy)

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
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
        {rows.map(({ original: {
          id, name, ean, quantity, unit, unitPrice, regularPrice, discount, chargedPrice,
        } }) => (
          <tr key={id} className="odd:bg-white even:bg-slate-100">
            <td className="border border-slate-600">
              <Link href="/">
                <a>{name}</a>
              </Link>
            </td>
            <td className="border border-slate-600">
              <Link href="/">
                <a>{ean}</a>
              </Link>
            </td>
            <td className="border border-slate-600 text-right">
              <Link href="/">
                <a>{quantity}</a>
              </Link>
            </td>
            <td className="border border-slate-600">
              <Link href="/">
                <a>{unit}</a>
              </Link>
            </td>
            <td className="border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(unitPrice)}</a>
              </Link>
            </td>
            <td className="border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(regularPrice)}</a>
              </Link>
            </td>
            <td className="border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(discount)}</a>
              </Link>
            </td>
            <td className="border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(chargedPrice)}</a>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Nota = ({ nota }) => {
  const { purchases } = nota
  return (
    <>
      <Head>
        <title>NFe Dashboard</title>
      </Head>

      <PurchasesTable purchases={purchases} />
    </>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query
  const nota = await prisma.nota.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      total: true,
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
        },
      },
    },
  })

  return {
    props: { nota: JSON.parse(JSON.stringify(nota)) }, // will be passed to the page component as props
  }
}

export default Nota
