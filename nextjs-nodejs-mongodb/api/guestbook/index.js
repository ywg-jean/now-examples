module.exports = async (req, res) => {
  // Set caching headers to serve stale content (if over a second old)
  // while revalidating fresh content in the background. 
  res.setHeader('cache-control', 's-maxage=1 maxage=0, stale-while-revalidate')

  // If the request method id "GET", retrieve and return a list of signatures
  if (req.method === "GET") {
    return require('./list')(req, res)
  } else if (req.method === "PATCH") {
    return require('./sign')(req, res)
  } else if (req.method === "DELETE") {
    return require('./delete')(req, res)
  } else {
    res.writeHead(405)
    res.end({message: `Error: The method ${req.method} is not available for this endpoint.`})
  }
}
