import prisma from 'lib/prisma';

import Head from 'next/head';
import { VStack } from '@chakra-ui/react';
import MarketTable from 'components/MarketTable';
import RoundedFrame from 'components/RoundedFrame';
import ReceiptsTable from 'components/ReceiptsTable';
import DeleteConfirmation from 'components/DeleteConfirmation';

function EditMarket({ market }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Mercado</title>
      </Head>
      <VStack alignItems="flex-start" gap={2}>
        <RoundedFrame>
          <MarketTable market={market} />
        </RoundedFrame>
        <RoundedFrame>
          <ReceiptsTable receipts={market.receipts} />
        </RoundedFrame>
        <DeleteConfirmation
          reqUrl={`/api/mercados/${market.id}`}
          redirectUrl="/mercados"
          header="Deletar Mercado"
          body="Tem certeza que deseja excluir esse mercado?"
        />
      </VStack>
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const { id } = query;
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
      receipts: {
        select: {
          id: true,
          date: true,
          total: true,
          market: { select: { name: true } },
        },
      },
    },
  });

  return { props: { market: JSON.parse(JSON.stringify(market)) } };
};

export default EditMarket;
