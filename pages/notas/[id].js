import { useMemo } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTable, useSortBy } from 'react-table'
import { prisma } from 'lib/prisma'
import { formatBRL } from 'lib/formatBRL'
import { dateSlice } from 'lib/dateSlice'

const PurchasesTable = ({ purchases }) => {
  const data = useMemo(() => purchases, [purchases])
  const totals = useMemo(() => purchases.reduce(
    (previousValue, currentValue) => {
      const { unitPrice, regularPrice, discount, chargedPrice } = previousValue
      return {
        unitPrice: unitPrice + (parseFloat(currentValue.unitPrice) || 0),
        regularPrice: regularPrice + (parseFloat(currentValue.regularPrice) || 0),
        discount: discount + (parseFloat(currentValue.discount) || 0),
        chargedPrice: chargedPrice + (parseFloat(currentValue.chargedPrice) || 0),
      }
    },
    { unitPrice: 0, regularPrice: 0, discount: 0, chargedPrice: 0 },

  ), [purchases])
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
    <table {...getTableProps()} className="border-collapse border border-slate-500 mx-auto">
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
            <td className="px-2 border border-slate-600">
              <Link href="/">
                <a>{name}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600">
              <Link href="/">
                <a>{ean}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600 text-right">
              <Link href="/">
                <a>{quantity}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600">
              <Link href="/">
                <a>{unit}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(unitPrice)}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(regularPrice)}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(discount)}</a>
              </Link>
            </td>
            <td className="px-2 border border-slate-600 text-right">
              <Link href="/">
                <a>{formatBRL(chargedPrice)}</a>
              </Link>
            </td>
          </tr>
        ))}
        <tr className="odd:bg-white even:bg-slate-100">
          <td colSpan={4} className="px-2 border border-slate-600 text-right" />
          <td className="px-2 border border-slate-600 text-right">
            <Link href="/">
              <a>{formatBRL(totals.unitPrice)}</a>
            </Link>
          </td>
          <td className="px-2 border border-slate-600 text-right">
            <Link href="/">
              <a>{formatBRL(totals.regularPrice)}</a>
            </Link>
          </td>
          <td className="px-2 border border-slate-600 text-right">
            <Link href="/">
              <a>{formatBRL(totals.discount)}</a>
            </Link>
          </td>
          <td className="px-2 border border-slate-600 text-right">
            <Link href="/">
              <a>{formatBRL(totals.chargedPrice)}</a>
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  )
}

const Nota = ({ nota }) => {
  const { purchases, market } = nota
  return (
    <>
      <Head>
        <title>NFe Dashboard</title>
      </Head>

      <main>
        <table className="standard-table">
          <tbody>

            <tr><td colSpan="2" className="text-center">Nota</td></tr>

            <tr><td>Chave de acesso</td><td>{nota.id}</td></tr>
            <tr><td>Data</td><td>{dateSlice(nota.date)}</td></tr>
            <tr><td>Total</td><td>{formatBRL(nota.total)}</td></tr>

            <tr><td colSpan="2" className="text-center">Mercado</td></tr>

            <tr><td>Nome</td><td>{market.name}</td></tr>
            <tr><td>Nome fantasia</td><td>{market.fantasia}</td></tr>
            <tr><td>CNPJ</td><td>{market.cnpj}</td></tr>
            <tr><td>Endreço</td><td>{market.address}</td></tr>
            <tr><td>CEP</td><td>{market.cep}</td></tr>
            <tr><td>Nome(alt)</td><td>{market.nickname}</td></tr>
          </tbody>
        </table>
        <PurchasesTable purchases={purchases} />
      </main>
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
