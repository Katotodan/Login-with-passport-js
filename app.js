const express = require("express")
const app = express()
const router = require('./routes/auth.js')

//DB Connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Chat-App')
.then(()=> console.log('DB connected'))
.catch(error => console.log(error))

const passport = require('passport');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
    uri: 'mongodb://127.0.0.1:27017/Chat-App',
    collection: 'mySessions'
})
// Catch errors
store.on('error', function(error) {
    console.log(error);
})

// Set EJS as templating engine 
app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: store
  }));
  app.use(passport.authenticate('session'))



app.use("/", router)
app.listen(5000, () => console.log('Server is running on port 5000'))