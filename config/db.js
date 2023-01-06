const mongoose = require('mongoose');
const config =require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try{
        mongoose.set('strictQuery', true);
        console.log('db===', db);
      await mongoose.connect(db , {
        useNewUrlParser:true
      });
      console.log('MongoDB Connected...')
    }
    catch(error){
      console.error('error', error.message);
      //exit process with failure
      process.exit(1);
    }
}
module.exports = connectDB;

