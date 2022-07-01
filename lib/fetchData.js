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
  if (response.status >= 200 && response.status <= 299) {
    if (response.status === 204) return

    return await response.json()
  }

  console.log(response.status, response.statusText)
  throw Error(response.statusText)
}
