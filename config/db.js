// const mongoose = require('mongoose')

//  function connectToDatabase () {
//     mongoose.connect('mongodb://127.0.0.1:27017/Tv-app')

//     const db = mongoose.connection

//     db.on('connected', () => {
//         console.log("Connected to MongoDB!!!")
//     })

// }
// module.exports = {
//     connectToDatabase
// }


const mongoose = require("mongoose");

// const mongoURI = 'mongodb://localhost/tv-shows-app';
const mongoURI = process.env.MONGODB_URL  

const db = async () => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(`MongoDB Connected on: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = db;