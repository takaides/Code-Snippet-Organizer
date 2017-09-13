const express = require('express');
const routes = express.Router();
const Snippet = require('../models/codesnippet');
const bodyParser = require('body-parser');


routes.get('/:snippet', function(req, res) {
  let oneSnippet = req.params.snippet;

  Snippet.find({title: oneSnippet})
  .then(snippets => res.render('snippet', {snippets: snippets}))
  .catch(err => res.send('Booooooo'));
});

routes.post('/globalresults', function(req, res) {
  let search = req.body.search;

  Snippet.find({$or: [{title: search}, {body: search}, {optionalNotes: search}, {language: search}, {tags: search}, {createdBy: search}]})
  .then(snippets => res.render('searchSnippet', {snippets: snippets}))
  .catch(err => res.send('Error in search'));
});

routes.post('/userresults', function(req, res) {
  let search = req.body.search;

  Snippet.find({createdBy: req.user.username, $or: [{'language': search}, {tags: search}]})
  .then(snippets => res.render('searchSnippet', {snippets: snippets}))
  .catch(err => res.send('Error in search'));
});

module.exports = routes;
