import { prisma } from '../lib/prisma'

import Head from 'next/head'

const Notas = ({notas}) => {

  console.log(JSON.parse(notas))
  
  return (
    <div>
      <Head>
        <title>NFe Dashboard</title>
      </Head>
      Notas        
    </div>
  )
}

export const getServerSideProps = async () => {

  const notas = await prisma.nota.findMany({select: {
    id: true,
    date: true,
    total: true,
    marketId: true, 
    createdAt: true,
    market: true,
    purchases: true,
  
  }})

  return {
    props: {notas: JSON.stringify(notas)}, // will be passed to the page component as props
  }
}

export default Notas