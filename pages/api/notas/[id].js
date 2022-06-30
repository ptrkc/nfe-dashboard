import { prisma } from 'lib/prisma'

const handler = async (req, res) => {
  const { method, query: { id } } = req

  if (method === 'DELETE') {
    await prisma.receipt.delete({ where: { id } })
    return res.status(204).end()
  }

  return res.status(504)
}

export default handler
