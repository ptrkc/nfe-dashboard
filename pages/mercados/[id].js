import { prisma } from 'lib/prisma'

import Head from 'next/head'
import { Flex } from '@chakra-ui/react'
import { MarketTable } from 'components/MarketTable'
import { RoundedFrame } from 'components/RoundedFrame'
import { ReceiptsTable } from 'components/ReceiptsTable'

const EditMarket = ({ market }) => (
  <>
    <Head>
      <title>NFe Dashboard | Mercado</title>
    </Head>
    <Flex direction="column" gap={2}>
      <RoundedFrame>
        <MarketTable market={market} />
      </RoundedFrame>
      <RoundedFrame>
        <ReceiptsTable receipts={market.notas} />
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

  return {
    props: { market: JSON.parse(JSON.stringify(market)) }, // will be passed to the page component as props
  }
}

export default EditMarket
