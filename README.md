# GameRecV2

**GameRecV2** is a web-based application designed to recommend and track video games. The application consists of both a frontend and a backend, which work together to provide a smooth user experience for managing and discovering games.

## Features:

- **Frontend:** Built using Vite, it serves as the interface where users can interact with the game database, view game recommendations, and perform various actions like filtering and searching games.
  
- **Backend:** A Node.js-based API that handles data management and processing for the frontend. It uses SQLite for database management and provides an endpoint for the frontend to fetch and display game information.
  
- **Dockerized Application:** The entire project is containerized using Docker, making it easy to deploy and manage in any environment. It consists of two services:
  - **Frontend:** The React-based user interface.
  - **Backend:** The API service powered by Node.js and SQLite.

## Technologies Used:
- **Frontend:** React, Vite, JavaScript, HTML, CSS
- **Backend:** Node.js, Express, SQLite
- **Docker:** Docker Compose for container orchestration

## Setup Instructions:

### Clone the Repository:
To get started, clone the repository:
```
git clone https://github.com/your-username/GameRecV2.git
``` 
### Set up keys:
```
cd GameRecV2
```
create a .env file and populate it with STEAM_API_KEY and RAWG_API_KEY.
    
### LOCALHOST VERSION: If you want to use Docker skip this step.
- if you dont want to use docker, you will have to change some code and have node/npm installed.
- In backend/server.js, uncomment line 11 and comment line 12.
- In frontend/vite.config.js, comment lines 7 and 9, and uncomment line 10.
- After making these changes, run the backend and frontend separately.
- **Backend:**
```
cd backend
npm install
node server.js
```
- **Frontend:**
```
cd frontend
npm install
npm run dev
```
    
### DOCKER VERSION: If you want to run it manually skip this step.
- Make sure to revert comments from above step if you have used localhost version before.
- Build and start the containers: Make sure you have Docker and Docker Compose installed. Then, from the root of the project, run:
```
docker-compose up --build
```
### Access the Application:
- The frontend will be available at http://localhost:5173.
- The backend API will be running on http://localhost:5000.

### Stopping the Application:
- To stop localhost just press ctrl + C on the terminals where frontend and backend are running. 
- To stop the docker containers, run: 
```
docker-compose down
```
