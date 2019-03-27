const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

const strategy = new JwtStrategy(opts, (payload, next) => {
  // GET user from DB
  const user = null;
  next(null, user);
});
passport.use(strategy);
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('J W T');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`The server is running in http://localhost:3000/`)
);
