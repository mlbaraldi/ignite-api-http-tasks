import http from 'node:http'
import { extractQueryParams } from '../utils/extract-query-params.js'
import { Database } from './db.js'
import { csv } from './middlewares/csv.js'
import { json } from './middlewares/json.js'
import routes from './routes.js'

const db = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url, rawHeaders } = req

  if (rawHeaders.find((header) => header.startsWith('multipart/form-data'))) {
    await csv(req, res)
  }
  await json(req, res)

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  )
  if (route) {
    const routeParams = req.url.match(route.path)

    const { query, ...params } = routeParams.groups
    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  res.writeHead(404).end()
})

server.listen(3333)
