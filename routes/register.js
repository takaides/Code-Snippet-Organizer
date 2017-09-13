const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const bodyParser = require('body-parser');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

routes.use(passport.initialize());
routes.use(passport.session());

passport.use(
  new LocalStrategy(function(email, password, done) {
    User.authenticate(email, password)
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      .catch(err => done(err));
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

routes.get('/login', (req, res) => {
  res.render('login', { failed: req.query.failed });
});

routes.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureFlash: true
  })
);


routes.get('/signup', (req, res) => {
  res.render('registration');
});

routes.post('/register', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user
    .save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
});

module.exports = routes;
