# codex-cool-webboard

A pure pastel color web board built with Node.js and SQLite where users can participate. The project supports user registration/login, posting messages with tags, and favorites functionality with a complete API service.

## Features

- User management (registration/login)
- Chat/messaging system
- Tags and favorites
- Pure pastel color design
- SQLite database integration
- Complete REST API service

## Setup

Install dependencies (internet access required):

```bash
npm install
```

Start the development server:

```bash
npm start
```

The application will start on port 3000. Visit `http://localhost:3000` to use the board.

## API Endpoints

- `POST /api/register` – Register a new user. Requires `username` and `password` in the body.
- `POST /api/login` – Login a user. Requires `username` and `password` in the body.
- `GET /api/posts` – List all posts.
- `POST /api/posts` – Create a post. Requires `userId`, `title` and `content`.
- `GET /api/posts/:id` – Get a single post with comments.
- `POST /api/posts/:id/comments` – Create a comment on a post. Requires `userId` and `content`.

## Development

The server will run on `http://localhost:3000` by default with both frontend and API services integrated. The database will be created automatically in `database.sqlite` when you run the server for the first time.
