const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('database.db');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false
}));

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    tag TEXT,
    favorite INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

function requireLogin(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ error: 'Not logged in' });
  next();
}

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users(username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) return res.status(400).json({ error: 'User exists' });
    req.session.userId = this.lastID;
    req.session.username = username;
    res.json({ id: this.lastID, username });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) return res.status(400).json({ error: 'Invalid username' });
    if (!bcrypt.compareSync(password, row.password)) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    req.session.userId = row.id;
    req.session.username = row.username;
    res.json({ id: row.id, username: row.username });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

app.get('/api/session', (req, res) => {
  if (!req.session.userId) return res.json(null);
  res.json({ id: req.session.userId, username: req.session.username });
});

app.post('/api/messages', requireLogin, (req, res) => {
  const { content, tag } = req.body;
  db.run('INSERT INTO messages(user_id, content, tag) VALUES (?, ?, ?)',
    [req.session.userId, content, tag], function(err) {
      if (err) return res.status(500).json({ error: 'db error' });
      res.json({ id: this.lastID });
    });
});

app.get('/api/messages', (req, res) => {
  db.all(`SELECT messages.id, users.username, messages.content, messages.tag,
                 messages.favorite, messages.created_at
          FROM messages
          JOIN users ON messages.user_id = users.id
          ORDER BY messages.created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json(rows);
  });
});

app.post('/api/favorite/:id', requireLogin, (req, res) => {
  db.run('UPDATE messages SET favorite = favorite + 1 WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'db error' });
    res.json({ success: true });
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on port ' + PORT));
