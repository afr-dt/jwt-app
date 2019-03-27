const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJWT;

const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderASBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};

app.get('/', (req, res) => {
  res.send('J W T');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`The server is running in http://localhost:3000/`)
);
