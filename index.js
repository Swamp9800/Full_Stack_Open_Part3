const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.use(morgan(':method :url :status :response-time ms - :body'))

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (req, res) => {
    const peopleSize = people.length
    const time = Date()
    body = `Phonebook has info for ${peopleSize} people
            <br><br>
            ${time}
            `
    res.send(body)
    
})

app.get('/api/persons', (req, res) => {
    res.status(200).json(people)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = people.find(p => p.id === id)

    if (person) {
        res.status(200).json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    people = people.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        })
    }

    if (people.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }

    const person = {
        id: String(Math.floor(Math.random()*10000)),
        name: body.name,
        number: body.number
    }
    people = people.concat(person)
    res.json(person)
})

// app.put('/api/persons/:id', (req, res) => {
//    const id = req.params.id
// })


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)


app.listen(3001)
console.log('server running on port 3001');
