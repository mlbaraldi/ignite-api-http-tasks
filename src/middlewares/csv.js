import { parse } from 'csv-parse'

export async function csv(req, res) {
  try {
    const tasksCSV = req.pipe(parse({ delimiter: ',' }))
    let count = 0

    for await (const task of tasksCSV) {
      if (count >= 1) {
        const [title, description] = task

        if (title && description) {
          await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title,
              description
            })
          })
        }
      }

      count += 1
    }
    return
  } catch (error) {
    console.error('Error processing CSV:', error)
    res.writeHead(500).end('Internal Server Error')
  }
}
