import { randomUUID } from 'node:crypto'

export class Task {
  constructor(title, description) {
    this.id = randomUUID()
    this.title = title
    this.description = description
    this.created_at = new Date()
    this.updated_at = this.created_at
    this.completed_at = null
  }
}
