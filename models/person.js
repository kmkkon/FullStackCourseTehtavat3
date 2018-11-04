const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url,{ useNewUrlParser: true })

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String
  }
)

const Person = mongoose.model('Person', personSchema)

module.exports = Person