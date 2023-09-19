const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local');

var db = require('../db.js');



passport.use(new LocalStrategy(async function verify(username, password, cb) {
  try {
    const user = await db.find({"username": username})
    if(user.length  == 0){
      console.log('No user')
      return cb(null, false, { message: 'Incorrect username or password.' })
    }
    if(user[0].password == password){
      console.log('same password')
      return cb(null, user)
    }else{
      console.log('Different password?')
      return cb(null, false, { message: 'Incorrect username or password.' })
    }
  } catch (error) {
    console.log(error)
    
  }
  
}));


router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})
router.get('/signup', function(req, res, next) {
  res.render('signup');
})

router.get('/login', (req,res)=>{
  res.render('login')
})

const checkUser =(req,res,next) =>{
  if(req.user){
      next()
  }else{
      res.redirect('/login')
  }
}
router.get('/', checkUser, (req, res)=>{
  res.render('home')
})

router.post('/signup', async function(req, res, next) {
  console.log(req.body)
  const user = new db({
    username: req.body.username,
    password: req.body.password
  })
  await user.save()
  req.login(user, function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
    
});

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, user);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
})
module.exports = router