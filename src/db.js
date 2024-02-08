import fs from 'node:fs/promises'

const dbPath = new URL('./db.json', import.meta.url)

export class Database {
  #database = {}

  #persist() {
    fs.writeFile(dbPath, JSON.stringify(this.#database))
  }

  constructor() {
    fs.readFile(dbPath, 'utf-8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist()
      })
  }

  get(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].includes(value)
        })
      })
    }

    return data ? data : []
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  post(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  put(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }

  completeTask(table, id) {
    let data = this.#database[table] ?? []

    const index = data.findIndex((task) => task.id === id)

    if (index === -1) {
      return
    }

    let date = new Date()
    data[index].completed_at = date
    data[index].updated_at = date

    this.#database[table] = data
    this.#persist()
    return data[index]
  }
}
