require('dotenv').config()
const mongoose = require('mongoose')

/* if (process.argv.length<3) {
  console.log('give password as an argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4] */

const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'Name required'],
  },
  number: {
    type: String,
    required: [true, 'Phone number required'],
    minLength: 3,
    validate: {
      validator: function(v) {
        const phoneRegex = /^\d{2,3}-\d+$/;
        return phoneRegex.test(v);
      },
      message: 'Phone number must be in the format of "XX-XXXXXXXXX" or "XXX-XXXXXXXXX".',
    }
  }
})

module.exports = mongoose.model('Person', personSchema)