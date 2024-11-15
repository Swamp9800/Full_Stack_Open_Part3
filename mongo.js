const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://luuk:${password}@cluster0.y7qj9.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(result)
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
