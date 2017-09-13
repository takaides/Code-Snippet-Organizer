const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const User = require('./models/user');
const Snippet = require('./models/codesnippet');

const createSnippet = require('./routes/createSnippet');
const registration = require('./routes/register');
const searchSnippet = require('./routes/search');

const app = express();

app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');

app.use(
  session({
    secret: 'this is a secret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

app.use('/', registration);
app.use('/createsnippet', createSnippet);
app.use('/search', searchSnippet)


const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    console.log('Not logged in, redirecting...')
    res.redirect('/login');
  }
};

app.get('/', requireLogin, function(req, res) {
  Snippet.find({
      createdBy: req.user.username
    })
    .then((snippets) => {
      res.render('home', {
        user: req.user,
        snippets: snippets
      })
    })
    .catch(err => res.send('Error logging in. :('));
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id)
    .remove()
    .then(() => res.redirect('/'));
});

mongoose
  .connect('mongodb://localhost:27017/newdb', {
    useMongoClient: true
  })
  .then(() => app.listen(3000, () => console.log('Code Snippet started!')));
