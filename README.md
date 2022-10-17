# vtArticleServer
#### A simple blogging tool to feed my portfolio site
#### By Jeffrey Press

## Description
This app was built to carry out the following behaviors:<br>
+ Passport-local strategy to authenticate valid blog authors.
+ Display existing articles for reference
+ Provide an HTML form for writing new blog posts.
+ Persist new posts to remote MongoDB Atlas cluster.
+ Provide a separate controller for front-end HTTP requests, to allow retrieval of blog posts from the database for display (see related repo <https://www.github.com/jmpress/vassilating-tesseract>)

## Specs
+ Backend admin interface designed with express-handlebars.
+ Administrative functions are locked behind user authorization utilizing Passport.js passport-local strategy.
+ Read-only express routes are exposed for accessing blog posts for display via HTTP GET requests.

## Setup/Installation Requirements
+ Fork and clone this repository locally.
+ Install Node.
+ Navigate to folder and run `npm install` in the console.
+ Set up your own MongoDB cluster at <https://www.mongodb.com>
+ create a local .env file with your MongoDB cluster connection string set as variable "DATABASE_URL"
+ run `npm start` in the console.
+ navigate to localhost:3000 to begin using the program.


## Known Bugs
+ It's not very pretty.

## Support and contact details
Please contact j.michael.press@gmail.com with questions, comments, or concerns. You are also welcome to submit a pull request.

## Technologies Used
   + Javascript
   + Node.js
   + Express
   + MongoDB
   + Passport.js
   + express-handlebars

### License
This software is released under the GNU general public license.

Copyright (c) 2022 Jeffrey Michael Press