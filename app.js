//A very simple API for personal use on localhost only.
//Allows entry of articles to persist to remote MongoDB database for retrieval later

//middleware via npm install
const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const helmet = require('helmet');
const store = new session.MemoryStore();
const cors = require('cors');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const dotenv = require('dotenv').config();
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { makeSaltedHash, comparePasswords } = require('./utils/utils');

//controllers
const articleRouter = require('./controllers/articleController');
const authRouter = require('./controllers/authController');
const adminRouter = require('./controllers/adminController');

//database handler
const db = require('./db/db');

// set paths for static content
app.use('/public', express.static(path.join(__dirname, "public")));

//view engine setup
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

// Set localHost port to listen at
const PORT = 80;

// Add middware for parsing request bodies here:
app.use(express.json());
app.use(express.urlencoded({extended: true})); 
app.use(cookieParser());

// Add middleware for handling CORS requests and security
app.use(cors());
app.use(helmet());

// middleware for logging
app.use(morgan('dev'));

// set up session
app.use(session({
    name: 'vtArticleServer',
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000*60*60, secure: false, sameSite: 'none' },
    secure: true,  //when in production, make it true.
    rejectUnauthorized: false,
    store
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const dbConnect = await db.connectToCluster();
    const dbName = dbConnect.db('vt-blog');
    const colName = dbName.collection('users');
    const loggedInUser = await colName.find({_id: id}).toArray();
  
    if (!loggedInUser) {
      return done(new Error('failed to deserialize'));
    }
    done(null, loggedInUser);
  
});

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const dbConnect = await db.connectToCluster();
    const dbName = dbConnect.db('vt-blog');
    const colName = dbName.collection('users');
    const result = await colName.find({email: username}).toArray();
    await dbConnect.close();

    if(!result){return done(new Error('no result in db'));}
    user = result[0];
    console.log(`inputPass: ${password}, dbPass: ${user.password}`)
      if (!user) {
          console.log('Incorrect username.');
          return done(null, false, { message: 'Incorrect username.' });
      } else if (!(await comparePasswords(password, user.password))) {
          console.log(`pass comparison failed`)
          console.log('Incorrect password');
          return done(null, false, { message: 'Incorrect password.' });
      } else {
          console.log('ok');
          done(null, user);
      }
    }) 
  ); 


app.get('/', (req, res, next) => {
  res.redirect('/auth/login');
});

app.use('/articles', articleRouter);
app.use('/auth', authRouter);
app.use('/admin', ensureAuthenticated, adminRouter);


// Add your code to start the server listening at PORT below:   
app.listen(PORT, () => {
    console.log(`Server inside container is listening on port ${PORT}`);
});

function ensureAuthenticated(req, res, next) {
  if(req.isAuthenticated()){ return next() };
  res.redirect('/auth/login');
}
