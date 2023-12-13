const mongoose = require('mongoose');
const Schema = mongoose.Schema
const env = require("dotenv")
env.config()

const bcrypt = require('bcryptjs');

let userSchema = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }],
})

let User;

function initialize() {
    return new Promise((resolve, reject) => {
    let db = mongoose.createConnection(process.env.MONGO_URI)
      //let db =  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        db.on('error', (err) => {
            reject(err)
        })

        db.once('open', () => {
            User = db.model("users", userSchema)
            console.log("MongoDB connected!")
            resolve()
        })
    })
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
function loginUser(userData) {
    return new Promise((resolve, reject) => {
        User.findOne({ username: userData.username })
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

module.exports = {
    initialize,
    registerUser,
    loginUser
}