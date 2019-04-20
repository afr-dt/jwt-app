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
const jwt = require('jsonwebtoken');

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

app.post('/sendUser', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('Ningun usuario');
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
  res.send('J W T App');
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send('Url protegido!!!');
  }
);

app.post('/getToken', (req, res) => {
  console.log(req.body);
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('No se enviaron datos!!!');
  }
  User.forge({ email: req.body.email })
    .fetch()
    .then(result => {
      if (!result) {
        return res.status(400).send('No se ha encontrado el usuario!!!');
      }
      result
        .authenticate(req.body.password)
        .then(user => {
          const payload = { id: user.id };
          const token = jwt.sign(payload, process.env.SECRET_OR_KEY);
          res.send(token);
        })
        .catch(err => {
          res.status(401).send({ err: err });
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`The server is running in http://localhost:3000/`)
);
