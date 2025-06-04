const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { db, init } = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

init();

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  const password_hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare('INSERT INTO users(username, password_hash) VALUES (?, ?)');
  stmt.run([username, password_hash], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Could not register user', details: err.message });
    }
    res.json({ id: this.lastID, username });
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      return res.status(400).json({ error: 'invalid username or password' });
    }
    if (!bcrypt.compareSync(password, row.password_hash)) {
      return res.status(400).json({ error: 'invalid username or password' });
    }
    res.json({ message: 'login successful', userId: row.id });
  });
});

app.get('/api/posts', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/posts', (req, res) => {
  const { userId, title, content } = req.body;
  if (!userId || !title || !content) {
    return res.status(400).json({ error: 'userId, title and content required' });
  }
  const stmt = db.prepare('INSERT INTO posts(user_id, title, content) VALUES (?, ?, ?)');
  stmt.run([userId, title, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, userId, title, content });
  });
});

app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'post not found' });
    db.all('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at', [postId], (cerr, comments) => {
      if (cerr) return res.status(500).json({ error: cerr.message });
      res.json({ ...row, comments });
    });
  });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { userId, content } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: 'userId and content required' });
  }
  const stmt = db.prepare('INSERT INTO comments(post_id, user_id, content) VALUES (?, ?, ?)');
  stmt.run([postId, userId, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, postId, userId, content });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
