![UNO Logo](./frontend/public/Uno%20Logo.png)

# UNO 

This project is a digital version of the classic **UNO card game**.

The application is divided into **Frontend** and **Backend**, communicating through a REST API and using **MongoDB** as the database.



## Project Overview

- Online UNO game
- User authentication (JWT)
- Game logic and rules
- Ranking system
- Web interface



## Technologies Used

### Backend
- Node.js (20+)
- Express
- MongoDB
- Mongoose
- JWT (authentication)
- Docker
- dotenv

### Frontend
- JavaScript (ES6+)
- React (Create React App)
- React Router DOM
- React Icons
- CSS



## ⚙️ How to Run the Project

### 1- Clone the repository

```
git clone <repository-url>
cd capstone-uno
```

---

## Backend Setup

### 2- Start MongoDB with Docker

Make sure Docker Desktop is installed and running.
```
docker run --name grupo1-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin \
  -d mongo
```

### 3- Configure environment variables

Create a .env file inside the backend/ folder:
```
DATABASE_URL=mongodb://admin:admin@localhost:27017/uno-db?authSource=admin
JWT_SECRET=capstone-uno
```

### 4- Install backend dependencies
```
cd backend
npm install
```

### 5- Run the backend API
```
npm run dev
```

If everything is correct, you should see:

```
Servidor rodando na porta 3000
Conectado ao MongoDB com sucesso!
```

---

## Frontend Setup

### 6- Install frontend dependencies

Open a new terminal:
```
cd frontend
npm install
```

### 7- Run the frontend
```
npm start
```


The application will open at:
```
http://localhost:3000
```

## API Testing

You can test the backend API using Postman or Insomnia.

- Base URL: http://localhost:3000

- Import the file UNO.postman_collection.json

To run automated tests:
```
cd backend
npm test
```


## 👥 Team

- Professor: Bruno Santos Cezario

- Practitioner: Adrian Fernandez

- Backend: João Neto, Lays Carvalho, Rafael Macedo

- Frontend: Laura Victória, Maria Alice Freitas, Pedro Carneiro


## Contato

- 📧 Email: lays.carvalho.dev@gmail.com  
- 💼 LinkedIn: https://www.linkedin.com/in/lays-cruz-carvalho/ 
- 💻 GitHub: https://github.com/lays-carvalho

