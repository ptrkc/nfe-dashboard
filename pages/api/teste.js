const handler = async (req, res) => {
  const { method, body } = req

  if (method === 'POST') {
    console.log(body)
    return res.status(200).json(body)
  }

  return res.status(504)
}

export default handler
