require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/phoneBook')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return null
})

app.use(morgan(':method :url :status :response-time ms - :body'))

app.get('/info', (req, res, next) => {
    Person.countDocuments()
        .then(count => {
            const time = new Date()
            const body = `
                <p>Phonebook has info for ${count} people</p>
                <p>${time}</p>
            `
            res.send(body)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch (error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body 

    const person = new Person ({
        name: body.name,
        number: body.number,
    })
    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const {name, number} = req.body

    Person.findByIdAndUpdate(
        req.params.id, 
        { name, number},
        { new: true, runValidators: true, context: 'query' },
    )
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// app.put('/api/persons/:id', (req, res) => {
//    const id = req.params.id
// })


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message);
    
    if (error.name === 'castError') {
        return res.status(400).send({ error: 'some error'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`server running on port ${PORT}`);
