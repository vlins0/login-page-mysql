const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const connection = require('./dbconfig');

const app = express();
const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Users WHERE Username = ?';
  connection.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      res.status(500).send('Server error');
    } else if (results.length > 0) {
      const hashedPassword = results[0].Password;
      bcrypt.compare(password, hashedPassword, (err, match) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.status(500).send('Server error');
        } else if (match) {
          res.redirect('/home');
        } else {
          res.send('Invalid username or password');
        }
      });
    } else {
      res.send('Invalid username or password');
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const query = 'INSERT INTO Users SET ?';
  connection.query(query, { Username: username, Password: hashedPassword }, (err, results) => {
    if (err) {
      console.error('Error during registration:', err);
      res.status(500).send('Server error');
    } else {
      res.redirect('/login');
    }
  });
});

// Home route
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//