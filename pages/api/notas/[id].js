import { prisma } from 'lib/prisma'

const handler = async (req, res) => {
  const { method, query: { id } } = req
  try {
    if (method === 'DELETE') {
      await prisma.receipt.delete({ where: { id } })
      return res.status(204).end()
    }
    return res.status(501)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}

export default handler
