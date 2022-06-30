import { prisma } from 'lib/prisma'

const getReceipts = () => prisma.receipt.findMany({
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
  orderBy: {
    date: 'desc',
  },
})

const handler = async (req, res) => {
  const { method } = req

  if (method === 'GET') {
    const receipts = await getReceipts()
    return res.status(200).json(receipts)
  }

  return res.status(504)
}

export default handler
