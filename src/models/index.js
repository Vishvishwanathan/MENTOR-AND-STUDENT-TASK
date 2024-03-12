const mongoose = require('mongoose');
const dotenv = require ("dotenv");
dotenv.config();
try {
  mongoose.connect(`${process.env.dbUrl}/${process.env.dbName}`);
  console.log ("Mongoo DB is connected");
} catch (error) {
  console.log(error);
}

module.exports = dotenv;