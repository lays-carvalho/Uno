
## Backend - About the project

This repository contains the backend of the UNO project, a game inspired by the famous card game, developed with Node.js, MongoDB, and Docker.

The backend’s goal is to provide a REST API to manage players, matches, and scores, integrating with a MongoDB database.

---

## Technologies Used

- [Node.js](https://nodejs.org/) (20+)
- [Express](https://expressjs.com/) (^5.1.0)
- [MongoDB](https://www.mongodb.com/)
- [Docker](https://www.docker.com/)
- [Mongoose](https://mongoosejs.com/) (^8.16.5)
- [JWT](https://jwt.io/) (^9.0.2)

---

## Project Structure

```

capstone-uno/
│
└── backend/
    ├── src/            # API source code
    ├── models/         # Mongoose models
    ├── services/       # Business logic
    ├── handlers/       # Route controllers
    ├── routes/         # Route definitions
    ├── test/           # Automated tests
    ├── .env.example    # Example environment variable configuration
    ├── package.json    # Project dependencies
    └── server.js       # Application entry point

```

---

## How to run

### Clone the Repository

```bash
git clone https://github.com/lays-carvalho/Uno.git
```

### Start docker with MongoDB

Make sure Docker Desktop is installed and running.
If you are on Linux, just ensure the Docker service is running properly.

To start a MongoDB container:

```bash
docker run --name grupo1-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  -d mongo
```

This command creates and starts a MongoDB container exposed on port **27017**.

⚠️ Docker is used only for local development.  
In production, the API runs on Render and connects to MongoDB Atlas.

### Setup .env file

Create a file called `.env` in `backend/`:

```env
DATABASE_URL=mongodb://admin:admin@localhost:27017/uno-db?authSource=admin
JWT_SECRET=capstone-uno
```

### Installing dependencies

```bash
npm install
```

### Running the API

To run the API, go in `backend` folder and execute:

```bash
npm run dev
```

If everything is correct, you should see:

```
Servidor rodando na porta 3000
Conectado ao MongoDB com sucesso!
```

---

## Testing the API

### Postman or Insomnia

- **Base URL:** `http://localhost:3000`
- Import the file `UNO.postman_collection.json` to test all the endpoints.

### Execute the unit tests

To run the unit tests, go in `backend` folder and execute:

```bash
npm test
```

### 🚀 Online Application

- ⚙️ Backend (API):  https://uno-backend-0pay.onrender.com
