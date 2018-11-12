const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.use(bodyParser.json())
app.use(morgan(':method :url :status :type :res[content-length] - :response-time ms'))
morgan.token('type', function (req, res) { return JSON.stringify(req.body)})
app.use(cors())
app.use(express.static('build'))


let persons = [
    {
        name: 'Arto Hellas',
        number: '040-123456',
        id: 1
      },
      {
        name: 'Martti Tienari',
        number: '040-123456',
        id: 2
      },
      {
        name: 'Arto Järvinen',
        number: '040-123456',
        id: 3
      },
      {
        name: 'Lea Kutvonen',
        number: '040-123456',
        id: 4
      }

]

app.get('/', (req, res) => {
  res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/api/info', (req, res) => {
  Person
    .find({})
    .then(people => {
      const now = new Date()
      res.send('<p>Puhelinluettelossa on tällä hetkellä ' + people.length + ' henkilön tiedot. </p> <p>' + now.toString() + '</p>')
        })
    .catch(error => {
      console.log(error)
    })
})

/*app.get('/api/persons', (req, res) => {
  res.json(persons)
})*/

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(people => {
      response.json(people.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  Person
  .findById(request.params.id)
  .then(person => {
    if (person){
      response.json(Person.format(person))
    } else {
      response.status(404).end()
    }
  })
  .catch(error =>{
    console.log(error)
    response.status(400).send({error: 'malformatted id'})
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (body.name === undefined){
    return response.status(400).json({error: 'missing name'})
  }
  if (body.number === undefined){
    return response.status(400).json({error: 'missing number'})
  }

  Person
  .find({name: body.name})
  .then(result =>{
    if (result.length>0){
      console.log('Person found', result)
      return response.status(400).json({error: 'Person already exists'})
    }
    else {
      console.log('Person not found', result)
      const person = new Person({
        name: body.name,
        number: body.number
      })
      person
      .save()
      .then(savedPerson => {
        response.json(Person.format(savedPerson))
    
      })
    
    }

  })

/*  if (persons.find(p => p.name === person.name) === undefined){
    persons = persons.concat(person)
  }
  else {
    return response.status(400).json({error: 'person already exists'})
  }*/
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})