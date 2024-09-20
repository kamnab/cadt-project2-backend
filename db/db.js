// npm install mongoose  
// using MongoDB Compass to connect to db

const mongoose = require('mongoose')
const dbName = "cadt-project2-backend-db"
const uri = `mongodb+srv://kamnab:P%40ssw0rd%40mdb@cluster0.iz4c7.mongodb.net/${dbName}`
//`mongodb://localhost:27017/${dbName}`

async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log("Mongodb Connected")
    })
    await mongoose.connect(uri, {
        dbName: dbName
    })
}

module.exports = dbConnect