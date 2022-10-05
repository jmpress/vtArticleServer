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
const db = require('./db/db');

//controllers
const articleRouter = require('./controllers/articleController');

//database handler




// set paths for static content
app.use('/public', express.static(path.join(__dirname, "public")));

//view engine setup
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

// Set localHost port to listen at
const PORT = process.env.PORT || 3000;

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
    
app.get('/', (req, res, next) => {
  res.redirect('/article/all');
});

app.use('/article', articleRouter);

// Add your code to start the server listening at PORT below:   
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});