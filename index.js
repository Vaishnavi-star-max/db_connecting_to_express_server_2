const express = require('express');
const { resolve } = require('path');
const mongoose =require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const user = require( './schema')
const User = mongoose.model('User', userSchema);

const app = express();
const port = process.env.PORT || 6565;


app.use(express.static('static'));


app.use(bodyParser.json());

const mongoUrl = process.env.mongodb;
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to database')
  })
  .catch((error) => {
    console.error('Error connecting to database', error)

  });




app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Validation error: All fields are required' });
  }

  try {
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message:` Validation error: ${error.message} `});
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});



app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
