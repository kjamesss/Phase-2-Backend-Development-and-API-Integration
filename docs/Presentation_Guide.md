# Class presentation and GitHub demonstration guide

**Phase 2 Backend Development and API Integration**  
**Group:** Phase 2 Backend Team  
**Project:** User and Product Management API

Use the PowerPoint speaker notes for the full explanation of each slide. The main presentation is slides 1 to 25. Slides 26 and 27 are references for questions and demo recovery. Allow about 15 to 20 minutes, including the live demonstration. Rehearse once on the computer you will use in class.

## Speaking order

| Member | Suggested part |
| --- | --- |
| Bea Roshan Pabilona | Introduction, scope, test results, documentation, and closing |
| Christian Balauro | Request flow, server, routes, controllers, user CRUD, and live requests |
| Simranjit Singh | Database connection, schemas, product CRUD, and persistence |
| Karl James Matias | GitHub navigation, setup, and commit history using kjamesss |

These speaking parts follow the assigned project roles. Review the relevant files and explain them in your own words.

## Opening explanation

“Our project is a backend API for users and products. It receives HTTP requests, checks the input, performs an operation in MongoDB, and returns JSON. We demonstrate create, read, update, and delete operations using Postman and a console script. Our GitHub repository contains the code, setup instructions, test results, and lab report.”

The correct activity title is Phase 2. The handout's Phase 3 title was a typo.

## GitHub walkthrough

Open the [repository](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration). Use the following order. Each link opens the actual file or folder.

| Open | What to explain |
| --- | --- |
| [Root README](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/README.md) | “This introduces our project and links to setup instructions, the report, and evidence.” |
| [backend folder](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/tree/main/backend) | “Each folder has a separate responsibility, so we can find and maintain the code more easily.” |
| [server.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/server.js) | “The server loads configuration and waits for MongoDB before listening on port 5000.” |
| [app.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/app.js) | “Express reads JSON, applies middleware, and mounts the user and product routes.” |
| [userRoutes.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/routes/userRoutes.js) | “The HTTP method and URL choose a controller function. Validation runs first.” |
| [crudController.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/controllers/crudController.js) | “The shared controller creates, retrieves, updates, and deletes documents.” |
| [userController.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/controllers/userController.js) | “User requests also hash passwords with scrypt and a random salt before saving.” |
| [User.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/models/User.js) | “This schema defines the user fields, validates values, and removes passwords from responses.” |
| [Product.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/models/Product.js) | “Products have different rules, including nonnegative prices and whole-number stock.” |
| [config/db.js](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/backend/config/db.js) | “Mongoose connects using MONGO_URI and waits for the model indexes.” |
| [Lab report](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/blob/main/docs/Lab_Report.md) | “The report connects the code explanations to actual test screenshots and output.” |
| [Evidence folder](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/tree/main/docs/evidence) | “The screenshots are supported by saved JSON results and test logs.” |
| [Commit history](https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration/commits/main/) | “The history records implementation, tests, and documentation changes.” |

For a short walkthrough, show README, server.js, userRoutes.js, User.js, and the evidence folder. If the professor chooses an endpoint, trace its route, controller, model, and response.

GitHub hosts the repository. The API runs on your computer after you start MongoDB and Express. Opening the repository does not start the server. Download an HTML report to view its rendered results locally, since GitHub may display its source code.

### Commits worth explaining

- `3b5c316`: modular Express backend and CRUD implementation.
- `2e5ade4`: integration tests and Postman collection.
- `f4afc31`: recorded results and console demonstration.
- `4bedd9e`: completed backend report with actual output.

The GitHub Manager account is `kjamesss`. Explain assigned responsibilities separately from commit authorship. The history also records an earlier frontend addition and its removal. The current submission follows the backend activity scope.

## Prepare the demonstration computer

Install Node.js 22 or later with npm. Git is needed only if you clone from a terminal. You may also use GitHub's Code menu to download the ZIP and extract it.

For a new clone, run:

```powershell
git clone https://github.com/kjamesss/Phase-2-Backend-Development-and-API-Integration.git
cd Phase-2-Backend-Development-and-API-Integration/backend
npm ci
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Keep an existing working .env. The default MONGO_URI uses a local MongoDB database. The local launcher downloads a real MongoDB executable on its first run, so finish this step before class while internet access is available.

Open three terminals, each inside the repository's backend folder.

**Terminal 1: database**

```powershell
npm run db:local
```

Keep this terminal running. If a working MongoDB service already uses port 27017 and matches your MONGO_URI, use that service and skip this launcher.

**Terminal 2: API**

```powershell
npm start
```

Expected messages include `MongoDB Connected` and `Server running on port 5000`. Keep this terminal running too.

**Terminal 3: demonstration**

```powershell
npm run demo
```

This sends 11 real HTTP requests. The demo checks their status codes and prints the actual JSON responses. It removes its own sample user and product before finishing.

## Narration during the live run

1. **Health:** “The health endpoint returns 200 and database: connected, so the API can reach MongoDB.”
2. **Create user:** “POST returns 201. The server gives the new user an ID. The response does not include the password.”
3. **Read user:** “GET uses that same ID and retrieves the stored document.”
4. **Update user:** “PUT changes the name while keeping the same ID.”
5. **Delete user:** “DELETE removes the document and returns its ID.”
6. **Read after deletion:** “The expected result is 404 because the record no longer exists.”
7. **Product sequence:** “We repeat the same operations with a product. Its price changes from 45.5 to 50 and stock changes from 10 to 8.”

A new run generates new IDs, emails, timestamps, and timings. Compare the behavior with the screenshots, rather than expecting identical values.

## Manual requests if the professor asks you to slow down

The commands below work in PowerShell. Run them in order in Terminal 3 while the database and API stay running. They use only the sample records they create. The printed result includes the HTTP status and response body.

### 1. Health

```powershell
$apiBase = 'http://127.0.0.1:5000'
$result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/health"
$result.StatusCode
$result.Content
```

Expected: `200`, `status: ok`, and `database: connected`.

### 2. Create a user

```powershell
$userBody = @{
  name = 'Class Demo User'
  email = "class.$([DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds())@example.test"
  password = 'LabPass123!'
  role = 'user'
} | ConvertTo-Json
$result = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "$apiBase/api/users" -ContentType 'application/json' -Body $userBody
$result.StatusCode
$result.Content
$demoUserId = ($result.Content | ConvertFrom-Json)._id
```

Expected: `201` and a user document with `_id`, but no password. The variable keeps the actual ID for the next requests.

### 3. Read the same user

```powershell
$result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/users/$demoUserId"
$result.StatusCode
$result.Content
```

Expected: `200` and the same stored record.

### 4. Update the name, then read it again

```powershell
$result = Invoke-WebRequest -UseBasicParsing -Method Put -Uri "$apiBase/api/users/$demoUserId" -ContentType 'application/json' -Body '{"name":"Updated Class User"}'
$result.StatusCode
$result.Content
$result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/users/$demoUserId"
$result.Content
```

Expected: `200`. Both responses show `Updated Class User`. The second request confirms persistence.

### 5. Delete, then confirm the expected 404

```powershell
$result = Invoke-WebRequest -UseBasicParsing -Method Delete -Uri "$apiBase/api/users/$demoUserId"
$result.StatusCode
$result.Content
try {
  $result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/users/$demoUserId" -ErrorAction Stop
  $result.StatusCode
  $result.Content
} catch {
  if ($null -ne $_.Exception.Response) {
    [int]$_.Exception.Response.StatusCode
    $_.ErrorDetails.Message
  } else {
    throw
  }
}
```

Expected: delete `200`, followed by read `404` with `User not found`. PowerShell treats the expected 404 as an HTTP error, so the catch block prints it.

### 6. Demonstrate products

```powershell
$result = Invoke-WebRequest -UseBasicParsing -Method Post -Uri "$apiBase/api/products" -ContentType 'application/json' -Body '{"name":"Class Notebook","price":45.5,"stock":10}'
$result.StatusCode
$result.Content
$demoProductId = ($result.Content | ConvertFrom-Json)._id
$result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/products/$demoProductId"
$result.Content
$result = Invoke-WebRequest -UseBasicParsing -Method Put -Uri "$apiBase/api/products/$demoProductId" -ContentType 'application/json' -Body '{"price":50,"stock":8}'
$result.StatusCode
$result.Content
$result = Invoke-WebRequest -UseBasicParsing -Uri "$apiBase/api/products/$demoProductId"
$result.Content
$result = Invoke-WebRequest -UseBasicParsing -Method Delete -Uri "$apiBase/api/products/$demoProductId"
$result.StatusCode
$result.Content
```

Expected: create `201`, update and delete `200`. The extra GET shows price `50` and stock `8`. To confirm deletion manually, repeat the previous try/catch using `$apiBase/api/products/$demoProductId`. It should return `404` and `Product not found`.

## Postman and tests

In Postman, import both files from docs/postman:

- `Phase2.postman_collection.json`
- `Local.postman_environment.json`

Select the local environment, then run requests in numbered order. The scripts capture IDs automatically. During an explanation, point to the method, URL, request body, response code, returned JSON, and assertions.

To execute the collection from Terminal 3:

```powershell
npm run test:postman
```

The saved reference run contains 20 requests and 52 passing assertions. Newman writes a new JSON result and HTML report under docs/evidence when you rerun it. A request can have several assertions. An expected 404 or 409 can be a passing test.

To run integration tests:

```powershell
npm test
```

The saved reference log contains 37 passing tests. These tests use a separate temporary MongoDB database. Run commands inside backend so package configuration is applied correctly.

## Questions and clear answers

**What is an API?**  
It provides endpoints that another program can call. Our endpoints accept HTTP requests and return JSON.

**What does Express do?**  
It matches routes, applies middleware, and sends responses. The database work happens through Mongoose models.

**What is the difference between MongoDB and Mongoose?**  
MongoDB stores documents. Mongoose is the Node.js library our code uses to define schemas and work with those documents.

**Why separate routes, controllers, and models?**  
Routes select the operation. Controllers perform it. Models define the stored data and its rules. This makes it easier to find and change one responsibility.

**How do you prove an update was saved?**  
Send another GET for the same ID and show the new value. After deletion, show the expected 404.

**Is the green report the frontend?**  
It is the HTML test report generated by Newman with newman-reporter-htmlextra. The current application exposes backend JSON endpoints. The report is a separate testing tool interface.

**Is the database fake because the package is named mongodb-memory-server?**  
No. The launcher starts a real MongoDB executable. The development launcher uses WiredTiger storage on disk. Integration tests use a separate temporary database.

**Why is .env missing from GitHub?**  
It holds local settings and may contain credentials. .env.example supplies the settings template without committing private connection strings.

**Are passwords protected?**  
The controller hashes passwords with scrypt and a random salt. Responses exclude the password. This phase does not implement authentication or authorization.

**Can an admin role access protected routes?**  
There are no protected routes in this phase. The role field stores data only. Permission checks would require additional code.

**Why use PUT for a partial update?**  
This implementation follows the activity's PUT convention. It applies the supplied editable fields and preserves omitted fields. We document that behavior explicitly.

**Does CORS protect the API like a login?**  
No. The configured CORS behavior controls browser access. It does not identify users or enforce permissions.

**What does the 100 percent in the screenshot mean?**  
The assertions for that request passed. It does not mean the project is guaranteed to be bug-free or to receive a particular grade.

## Demo recovery and closing

| Problem | Action |
| --- | --- |
| Connection refused | Check that the API terminal is running and the URL uses port 5000. |
| Startup failed | Check MongoDB, MONGO_URI in .env, and the database terminal. |
| EADDRINUSE | A port is already occupied. Use the intended existing service or stop your duplicate process. |
| 409 on a user POST | Use a fresh email. This demonstrates the unique email constraint. |
| First database launch cannot download | Complete the download while internet is available before class. |
| Live setup unavailable | Show the saved backend-demo.txt and report, clearly identifying them as recorded results. |

Suggested closing: “The project meets the backend activity requirements through a modular Express application, working MongoDB models, tested CRUD endpoints, and documented results. We can trace any demonstrated request from its route to the database operation and its JSON response.”
