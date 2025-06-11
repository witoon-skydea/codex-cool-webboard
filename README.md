# codex-cool-webboard

A pure pastel color web board built with Node.js and SQLite where users can participate. The project supports user registration/login, posting messages with tags, and favorites functionality with a complete API service and frontend interface.

## Features

- **Frontend**: Simple pastel-colored web interface that works entirely in the browser
- **Backend**: Complete REST API service with SQLite database
- **User management**: Registration/login functionality
- **Chat/messaging system**: Post messages and comments
- **Tags and favorites**: Organize and save favorite posts
- **Pure pastel color design**: Beautiful, modern UI
- **Data storage**: Both localStorage (frontend) and SQLite database (backend) support

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

The server will run on `http://localhost:3000` by default with both frontend and API services integrated. The frontend works entirely in the browser and can store posts in `localStorage`, while the backend database will be created automatically in `database.sqlite` when you run the server for the first time.

## Alternative Scripts

- `npm start` - Run the main integrated server
- `npm run start:api` - Run only the API server (if needed separately)
