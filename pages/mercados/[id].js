import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { MarketTable } from 'components/MarketTable'
import { RoundedFrame } from 'components/RoundedFrame'
import { NotasTable } from 'components/NotasTable'
import { Flex } from '@chakra-ui/react'

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Mercado</title>
    </Head>
    <Flex direction="column" gap="2">
      <RoundedFrame>
        <MarketTable market={market} />
      </RoundedFrame>
      <RoundedFrame>
        <NotasTable notas={market.notas} />
      </RoundedFrame>
    </Flex>
  </>
)

export const getServerSideProps = async ({ query }) => {
  const { id } = query
  const market = await prisma.market.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      fantasia: true,
      cnpj: true,
      address: true,
      cep: true,
      nickname: true,
      notas: {
        select: {
          id: true,
          date: true,
          total: true,
          market: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  console.log(market)

  return {
    props: { market: JSON.parse(JSON.stringify(market)) }, // will be passed to the page component as props
  }
}

export default EditMarket
