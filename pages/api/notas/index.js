import logger from 'lib/logger';
import prisma from 'lib/prisma';

const getReceipts = () => prisma.receipt.findMany({
  select: {
    id: true,
    date: true,
    total: true,
    market: { select: { name: true } },
  },
  orderBy: { date: 'desc' },
});

const getReceiptsByMonth = (startDate, endDate) => prisma.receipt.findMany({
  select: {
    id: true,
    date: true,
    total: true,
    market: { select: { name: true } },
  },
  where: {
    date: {
      gte: new Date(startDate),
      lt: new Date(endDate),
    },
  },
  orderBy: { date: 'asc' },
});

const handler = async (req, res) => {
  const { method, query: { startDate, endDate } } = req;
  try {
    if (method === 'GET') {
      const receipts = (startDate && endDate)
        ? await getReceiptsByMonth(startDate, endDate)
        : await getReceipts();
      return res.status(200).json(receipts);
    }

    return res.status(501);
  } catch (error) {
    logger(error);
    return res.status(500).json(error);
  }
};

export default handler;
