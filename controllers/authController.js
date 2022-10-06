const express = require('express');
const db = require('../db/db');
const Router = require('express-promise-router');
const authRouter = new Router();
const { makeSaltedHash, comparePasswords, sanitizeInput } = require('../utils/utils');
const passport = require('passport');

authRouter.route('/login')
    .get((req, res, next) => {
        res.render('login');
    })
    .post(passport.authenticate('local', { 
        successRedirect: '/admin/all', 
        failureRedirect: '/auth/login' 
    }));

authRouter.post('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/auth/login');
    });
  });

module.exports = authRouter;