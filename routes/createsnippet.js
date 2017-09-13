const express = require('express');
const routes = express.Router();
const Snippet = require('../models/codesnippet');
const bodyParser = require('body-parser');


routes.get('/new', (req, res) => {
  res.render('createSnippet', {user: req.user});
});

routes.post('/create', (req, res) => {
  let snippet = new Snippet(req.body);
  snippet.provider = 'local';

  snippet
    .save()
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
});

module.exports = routes;
