// npm install mongoose  
// using MongoDB Compass to connect to db

const mongoose = require('mongoose')
const dbName = "cadt-project2-backend-db"
// const uri = `mongodb+srv://kamnab:P%40ssw0rd%40mdb@cluster0.iz4c7.mongodb.net/${dbName}`
const uri = `mongodb://${process.env.DB_HOST}:27017/${dbName}`

async function dbConnect() {
    mongoose.connection.on('connected', () => {
        console.log("Mongodb Connected: " + process.env.DB_HOST)
    })
    await mongoose.connect(uri, {
        dbName: dbName
    })
}

module.exports = dbConnect