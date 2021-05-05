const express = require('express');
const router = express.Router();
// enter your code here
const users = require('../model/users');

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) res.status(400).send('You are not logged in!');
  else next();
};

router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email && password) {
    const user = users.find((el) => el.email === email && el.password === password);
    if (user) {
      req.session.userId = user.id;
      res.status(200).json({ id: user.id, name: user.name });
    } else res.status(401).send('Wrong email or password');
  } else res.status(400).send('Login failed');
});

router.get('/logout', redirectLogin, (req, res) => {
  // enter your code here
  req.session.destroy();
  res.clearCookie(process.env.SESSION_NAME);
});

router.post('/register', (req, res) => {
  // enter your code here
  let email = req.body.email;
  let password = req.body.password;
  let name = req.body.name;

  if (name && password && email) {
    if (users.find((el) => el.email == email)) {
      res.status(409).send('Email already registered');
    } else {
      let maxID = 0;
      for (let i of users) {
        if (i.id > maxID) {
          maxID = i.id;
        }
      }
      let newID = maxID + 1;
      req.session.userId = newID;
      users.push({ id: newID, name: name, email: email, password: password });
      res.status(200).send({ id: maxID, name: name });
    }
  } else {
    res.status(400).send('Registration failed');
  }
});

router.get('/secretdata', redirectLogin, (req, res) => {
  // enter your code here
  return res.status(200).end('the prime number is 2305843009213693951');
});

module.exports = router;
