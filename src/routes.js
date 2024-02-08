import { Task } from '../models/Task.js'
import buildRoutePath from '../utils/build-route-path.js'
import { Database } from './db.js'
const db = new Database()

const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      let { search } = req.query
      const searchQuery = search ? { title: search.replace(/\+/g, ' ') } : null

      const tasks = db.get('task', searchQuery)
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(400).end('Missing title or description')
      }

      const task = new Task(title, description)
      const createdTask = db.post('task', task)

      return res.writeHead(201).end(JSON.stringify(createdTask))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const task = new Task(title, description)
      task.id = id
      db.put('task', id, task)
      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) return res.status(404).json({ error: 'Id is required' })

      const task = db.completeTask('task', id)

      if (!task)
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'Task not found' }))

      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      db.delete('task', id)
      return res.writeHead(204).end()
    }
  },

  {
    method: 'POST',
    path: buildRoutePath('/importCSV'),
    handler: (req, res) => {
      return res.writeHead(201).end()
    }
  }
]

export default routes
