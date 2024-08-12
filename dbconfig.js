const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',       // e.g., 'localhost'
  user: 'root',
  password: 'root',
  database: 'userauth'
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database.');
  }
});

module.exports = connection;