# codex-cool-webboard

This project provides a simple API service for a pastel color themed web board. It is built with Node.js, Express and SQLite.

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

The API will be available on `http://localhost:3000`.

## API Endpoints

- `POST /api/register` – Register a new user. Requires `username` and `password` in the body.
- `POST /api/login` – Login a user. Requires `username` and `password` in the body.
- `GET /api/posts` – List all posts.
- `POST /api/posts` – Create a post. Requires `userId`, `title` and `content`.
- `GET /api/posts/:id` – Get a single post with comments.
- `POST /api/posts/:id/comments` – Create a comment on a post. Requires `userId` and `content`.

The database will be created automatically in `db.sqlite` when you run the server for the first time.
