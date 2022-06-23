const handler = async (req, res) => {
  const { method, body } = req

  if (method === 'POST') {
    console.log(body)
    return res.status(204).json()
  }

  return res.status(504)
}

export default handler
