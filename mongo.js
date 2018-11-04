const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url, {useNewUrlParser: true})

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length===4){
  console.log('Lisätään henkilön ' + process.argv[2] + ' numero ' + process.argv[3] + ' luetteloon')
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })
  person
  .save()
  .then(response => {
    mongoose.connection.close()
  })
  
}
else if (process.argv.length===2){
  Person
  .find({})
  .then(result => {
    console.log('Puhelinluettelo:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
}
else {
  console.log("Ihan väärä määrä argumentteja")
  mongoose.connection.close()
}

