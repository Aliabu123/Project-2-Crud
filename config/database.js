const mongoose = require('mongoose')

 function connectToDatabase () {
    mongoose.connect('mongodb://127.0.0.1:27017/Tv-app')

    const db = mongoose.connection

    db.on('connected', () => {
        console.log("Connected to MongoDB!!!")
    })

}
module.exports = {
    connectToDatabase
}