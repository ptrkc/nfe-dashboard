import prisma from 'lib/prisma';

import Head from 'next/head';
import { VStack } from '@chakra-ui/react';

import MarketTable from 'components/MarketTable';
import ReceiptsTable from 'components/ReceiptsTable';
import DeleteConfirmation from 'components/DeleteConfirmation';

function EditMarket({ market }) {
  return (
    <>
      <Head>
        <title>💸 NFe Dashboard | Mercado</title>
      </Head>
      <VStack alignItems="flex-start" gap={2}>
        <div className="rounded-frame">
          <MarketTable market={market} />
        </div>
        <div className="rounded-frame">
          <ReceiptsTable receipts={market.receipts} />
        </div>
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
