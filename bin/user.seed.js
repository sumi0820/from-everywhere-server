const mongoose = require('mongoose')

require('../config/db.config')
const UserModel = require('../models/User.model')

UserModel.create({
  username: "sumiya",
  email: "sumiya@gmail",
  password: 'Test@12345',

}).then(()=>{
  console.log("Data added");
  mongoose.connection.close()
}).catch(err=>{
  console.log(err);
})