require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const knex = require('knex');
const knexDb = knex({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING
});
const bookshelf = require('bookshelf');
const securePassword = require('bookshelf-secure-password');
const db = bookshelf(knexDb);

db.plugin(securePassword);

const User = db.Model.extend({
  tableName: 'users',
  hasSecurePassword: true
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  // GET user from DB
  User.forge({ id: payload.id })
    .fetch()
    .then(res => {
      next(null, res);
    });
});

passport.use(strategy);
app.use(passport.initialize());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.post('/seedUser', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('no fields');
  }

  console.log(req.body);

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save().then(() => {
    res.send('ok');
  });
});

app.get('/', (req, res) => {
  res.send('J W T');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`The server is running in http://localhost:3000/`)
);
