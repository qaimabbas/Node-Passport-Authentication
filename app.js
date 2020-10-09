const express=require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const session = require ('express-session');

const app = express ();



// Passport Config
require('./config/passport')(passport);

//body parser setup

app.use(express.urlencoded({ extended : false})); 



// express session 
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// flash connection

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next(); 
   })

// database
const db = require ('./config/keys').MongoURI;
// connection
mongoose.connect(db,{ useNewUrlParser : true})
.then(() =>console.log('database connected...'))
.catch(err =>console.log(err));


// Ejs setup

app.use(expressLayouts);
app.set('view engine' , 'ejs');
// routes
app.use('/', require('./routes/index')); 
app.use('/', require('./routes/users')); 



// server
const PORT = process.env.PORT || 4000 ;

app.listen(PORT, console.log('server started on port ${PORT}'));