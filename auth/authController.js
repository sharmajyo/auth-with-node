const express = require('express');
const router = express.Router();
const parser = require('body-parser');
router.use(parser.urlencoded({ extended: false }));
router.use(parser.json());
const User = require('../user/User');
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcryptjs');
const config = require('../config');

router.post('/register', (req, res) => {
  const hasedPwd = bcrypt.hashSync(req.body.password, 8);

  User.create({
    name: req.body.anme,
    password: hasedPwd,
    email: req.body.email,
  }, (err, user) => {
    if (err) {
      return res.status(500).send("There was a problem registering the user.");
    }
    const token = jwt.sign({ id: user._id}, config.secret, { expiresIn: 86400});
    res.status(200).send({ auth: true, token });
  });
})

router.get('/me', (req, res) => {
  console.log(req.headers);
  const token = req.headers['x-access-token'];

  if(!token){
    return res.status(401).send({ auth: false, message: 'invalid token' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }
    res.status(200).send(decoded);
  });

  router.post('/login', () => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return res.status(500).send('Error on the server.');
      }
      if (!user) {
        return res.status(404).send('No user found.');
      }
      const isvalidPwd = bcrypt.compareSync(rewq.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      }
      const token = jwt.sign({ id: user._id}, config.secret, { expiresIn: 86400});
      res.status(200).send({ auth: true, token });
    });
  })
})

module.exports = router;