const mongoose = require('mongoose');
const env = require("dotenv");
const e = require('express');

const bcrypt = require('bcryptjs');
env.config()
  
let Schema = mongoose.Schema;

let userSchema = new Schema({
  userName:{
    type: String,
    unique:true,
  },
  password: String,
  email: String,
  loginHistory: [{
    dateTime: Date,
    userAgent: String
}],
});

let User;

 //connection to Mongo DB
 async function connect()
 {
    try{
        await mongoose.connect(process.env.MONGODB);
        console.log("Connected to Mongo DB");
    }
    catch(error)
    {
        console.log(error);
    }
 }


function initialize()
{
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.MONGODB);
        db.on('error', (err)=>{
        reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
        User = db.model("users", userSchema);

        resolve();
        });
        });
}
function registerUser(userData) {
  
  return new Promise((resolve, reject) => {
      if (userData.password != userData.password1) {
          reject("Passwords do not match!")
      }

      // Encrypt the plain text: "myPassword123"
      bcrypt
          .hash(userData.password, 10)
          .then((hash) => {
              userData.password = hash
              const newUser = new User(userData);

              newUser.save().then(() => {
                  resolve("User registration successful")
              }).catch((err) => {
                  if (err.code == 11000) {
                      reject("Username is already taken!")
                  }
                  reject("There was an error registering user: " + err)
              })
          })
          .catch((err) => {
              reject("Password encryption error " + err)
          })

  })
} 
 
function verify(userData) {
  return new Promise((resolve, reject) => {
      User.findOne({ username: userData.userName })
          .exec()
          .then((user) => {
              bcrypt.compare(userData.password, user.password).then((result) => {
                  if (result) {
                      const loginHistoryObj = {dateTime: new Date(), userAgent: userData.userAgent}
                      user.loginHistory.push(loginHistoryObj)
                      // either add the array of loginHistories or add a single one:
                      User.updateOne({ username: user.username }, { $set: { loginHistory:  user.loginHistory} })
                      .exec()
                      .then(() => {
                          resolve(user)
                      }).catch((err) => {
                          reject("LOGIN HISTORY UPDATE FAILED")
                      })
                  } else {
                      reject("Credentials incorrect!")
                  }
              }).catch((err) => {
                  reject("Credentials incorrect!")
              })
          }).catch((err) => {
              reject("Credentials incorrect!")
          })
  })
}

  
  module.exports = { initialize,registerUser,verifyUser}