const express = require('express');
const  router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login',(req, res)=>res.render('login') );

router.get('/register',(req, res)=>res.render('register') );

// user model
const User= require('../models/User'); 

 
// register handling 

router.post('/register',(req,res)=> {

    const{name,email,password,password2}= req.body;
    let errors=[];
    


   // fields input checking errors by user 



  if (!name || !email || !password || !password2) {

     errors.push({ msg: 'Please enter all fields' });
   }

   if (password != password2) {

     errors.push({ msg: 'Passwords do not match' });
   }

   if (password.length < 6) {

     errors.push({ msg: 'Password must be at least 6 characters' });
   }

   if (errors.length >0 ){
       res.render('register',{
           errors,
           name,
           email,
           password,
           password2
       })
   }
   else{
       // finding user existance  in database 
       User.findOne({email : email})
       .then( user =>{
           if (user){
               errors.push({msg :'user already exist'});
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            })
           }
           else{
               const newUser = new User({

                name,
                email,
                password
               }); 

            
              // bcrypt password

              bcrypt.genSalt(10, (err,salt)=> bcrypt.hash(newUser.password , salt,(err,hash)=>{

              if (err)throw err;
              // set password to hash vairable
              newUser.password= hash ;


              // save in database and redirect to login with flash message 

              newUser
              .save
              ((err, data) => {
                //if (err) throw err;
                req.flash('success_msg', "Registered Successfully.. Login To Continue..");
                res.redirect('/login');
            });

              } ) )
           }
           
       });
   }
   

});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});




module.exports = router ; 