const defaultOptions = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
}

export const fetchData = async (url, options = {}) => {
  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    ...(options.body && { body: JSON.stringify(options.body) }),
  })
  if (response.ok) {
    try {
      return await response.json()
    } catch {
      return response.statusText
    }
  }

  console.log(response.status, response.statusText)
  throw Error(response.statusText)
}
