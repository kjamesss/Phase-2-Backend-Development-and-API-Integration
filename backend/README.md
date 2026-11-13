# Backend setup and API reference

This backend serves users and products through Express. Mongoose validates documents and stores them in MongoDB. Routes select the operation, controllers perform database work, models define stored data, and middleware returns consistent validation and error responses.

## Requirements

- Node.js 22 or later, with npm.
- A local MongoDB server or a MongoDB Atlas connection string.
- Postman or Thunder Client for interactive requests. Newman runs the included Postman collection from the command line.

## Install and configure

```powershell
cd backend
npm ci
Copy-Item .env.example .env
```

On macOS or Linux, replace the copy command with `cp .env.example .env`.

The initial packages required by the activity are Express, Mongoose, CORS, dotenv, and nodemon. They are recorded in `package.json` and locked in `package-lock.json`. To recreate package installation from the activity, the command is `npm install express mongoose cors dotenv nodemon`; use `npm ci` to reproduce this submission exactly.

| Variable | Local value | Purpose |
| --- | --- | --- |
| PORT | 5000 | Express listening port |
| MONGO_URI | mongodb://127.0.0.1:27017/phase2_backend | MongoDB connection |
| CORS_ORIGIN | http://localhost:3000 | Frontend origin allowed by CORS |
| NODE_ENV | development | Environment label |

`.env` exists locally and is ignored by Git because real connection strings can contain credentials. `.env.example` is the committed configuration template. For Atlas, replace `MONGO_URI` locally with your connection string and configure your Atlas database user and network access.

## Start MongoDB and Express

If MongoDB is not installed, the included development launcher downloads and starts a real MongoDB executable on loopback port 27017. It uses the `mongodb-memory-server` package as a launcher and WiredTiger stores the local demo data on disk in `.local-db`. It does not use an in-memory substitute for Mongoose queries. The first run needs internet access and a supported MongoDB platform. Skip this launcher if another MongoDB server already uses port 27017.

```powershell
# Terminal 1, inside backend
npm run db:local

# Terminal 2, inside backend
npm start
```

The required start script is `nodemon server.js`. `npm run serve` runs `node server.js` without watching files. Successful startup prints `MongoDB Connected` and `Server running on port 5000`. Express starts only after MongoDB connects and the model indexes are ready. `GET http://127.0.0.1:5000/api/health` returns `200` with `database: connected`.

## Folder structure

```text
backend/
  server.js                Environment, connection, startup, shutdown
  app.js                   Express middleware and route mounting
  config/db.js             MongoDB connection and model indexes
  models/User.js           User schema and password response filtering
  models/Product.js        Product schema
  controllers/             CRUD operations and user password hashing
  routes/                  User and product route declarations
  middleware/              Request validation and error handling
  scripts/                 Local database and Postman runner
  tests/api.test.js        Database-backed integration tests
  .env.example             Safe configuration template
```

## Models

The **User** model contains `name`, `email`, `password`, and `role`, plus timestamps. Names require 2 to 80 characters. Email addresses are normalized to lowercase and protected by a unique database index. Password input requires 8 to 128 characters. The controller hashes passwords using Node.js scrypt with a fresh random salt before storing them. Passwords are excluded from query selection and JSON responses. Roles accept `user` or `admin`, defaulting to `user`.

The **Product** model contains `name`, `description`, `price`, and `stock`, plus timestamps. Product names require 2 to 120 characters. Prices must be nonnegative numbers. Stock must be a nonnegative integer. The request layer rejects unsupported fields and unexpected data types before a controller runs.

## Routes

All requests and responses use JSON. Send `Content-Type: application/json` with POST and PUT.

| Method | Route | Successful result |
| --- | --- | --- |
| GET | /api/health | 200 database connection status |
| POST | /api/users | 201 created user without password |
| GET | /api/users | 200 array of users |
| GET | /api/users/:id | 200 selected user |
| PUT | /api/users/:id | 200 updated user |
| DELETE | /api/users/:id | 200 deletion message and ID |
| POST | /api/products | 201 created product |
| GET | /api/products | 200 array of products |
| GET | /api/products/:id | 200 selected product |
| PUT | /api/products/:id | 200 updated product |
| DELETE | /api/products/:id | 200 deletion message and ID |

PUT applies the supplied editable fields and preserves omitted fields. This partial-update behavior follows the activity's PUT route convention. The list endpoints accept `?page=1&limit=20`, with a maximum limit of 100. Results are sorted by ID so repeated page requests have a consistent order.

Example POST `/api/users`:

```json
{
  "name": "API Lab User",
  "email": "api.lab@example.test",
  "password": "LabPass123!",
  "role": "user"
}
```

Example POST `/api/products`:

```json
{
  "name": "Lab Notebook",
  "description": "API testing sample",
  "price": 45.5,
  "stock": 10
}
```

## Error responses

| Status | Meaning |
| --- | --- |
| 400 | Invalid JSON, malformed ID, missing fields, or invalid values |
| 404 | Resource or route does not exist |
| 409 | Email address already exists |
| 413 | JSON body exceeds 32 KB |
| 500 | Unexpected server failure with a generic client message |
| 503 | Health check reports a disconnected database |

## Test the API

```powershell
# Database-backed integration tests use a separate temporary database
npm test

# Start the local database and Express first, then run the Postman collection
npm run test:postman
```

The Postman runner writes `docs/evidence/newman-results.json` and `docs/evidence/postman-test-report.html`. Open the HTML file in a browser to inspect each request and response. Import `docs/postman/Phase2.postman_collection.json` and `Local.postman_environment.json` into Postman, select the local environment, and run requests in their numbered order. IDs are captured automatically. Test addresses use the reserved `.test` domain and the collection removes its own created records.

For Thunder Client, create a request using the same method, URL, and JSON body. Copy `_id` from the POST response into the PUT and DELETE URLs. The screenshots in `docs/evidence` document the completed test run.

## Frontend integration

```javascript
const response = await fetch('http://127.0.0.1:5000/api/products');
if (!response.ok) throw new Error('Could not load products');
const products = await response.json();
```

The frontend can use the same base URL with POST, PUT, and DELETE, passing JSON bodies where needed. Set `CORS_ORIGIN` to the frontend's actual origin. CORS controls browser access and does not provide user authentication.

## Scope and maintenance

This is a local coursework backend. Authentication, authorization, login sessions, deployment, and a frontend are outside this phase. The `role` field is stored data only. Keep the server on loopback until authentication and access checks are added. Newman and its HTML reporter are development tools; their upstream dependency audit findings are separate from the runtime dependency audit saved in the evidence folder.
