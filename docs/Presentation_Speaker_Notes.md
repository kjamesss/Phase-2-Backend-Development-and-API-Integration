# Presentation speaker notes

Use these notes while rehearsing. PowerPoint also includes them in the Notes pane and Presenter View.

## Slide 1: Phase 2

Bea: Good day. We are the Phase 2 Backend Team. Our project is a User and Product Management API for IS Elec 2. We will explain the backend structure, show the actual request results, and demonstrate how to run the project from our GitHub repository. The activity title is Phase 2, correcting the typo in the handout. Suggested presentation length: 15 to 20 minutes including the live demonstration.

## Slide 2: Project scope

Bea: The activity requires a backend with a database and tested CRUD routes. CRUD means create, read, update, and delete. We applied those operations to users and products. Our output is JSON. Postman, Newman, and the console script act as clients that send requests. There is no application frontend in the current submission. GitHub contains the source and evidence. The running API is on the demonstration computer. Authentication and deployment belong to a later phase.

## Slide 3: How one request reaches the database

Christian: Follow a POST /api/users request. A client sends JSON to Express. The route matches POST and validates the body. The controller hashes the password and asks the User model to save the record. Mongoose checks the schema and sends the database operation to MongoDB. Express then returns the saved record as JSON with status 201. The password is removed from the response. Each layer has a separate job, which makes changes easier to locate and test.

## Slide 4: Backend folder structure

Christian: Open backend in GitHub and point to each folder while explaining it. server.js controls startup. app.js wires together Express middleware and routes. config/db.js connects to the database. The models define stored data. Routes select controllers. Controllers perform database operations. Middleware validates requests and formats errors. scripts contains the runnable demo and test runner. tests contains automated checks. Splitting server startup from the app lets tests exercise the app without using the live demonstration port.

## Slide 5: Server startup

Christian: This is an exact excerpt from server.js. dotenv loads local configuration. start first awaits connectDB. That means the API does not begin accepting requests before MongoDB is available. The port defaults to 5000. The 127.0.0.1 binding keeps the coursework API on the local computer. The full file also closes the HTTP server and disconnects Mongoose during shutdown, and reports startup failures. Show the complete file on GitHub if asked.

## Slide 6: MongoDB connection

Simranjit: This is the actual connection function. MONGO_URI comes from the local .env file. mongoose.connect opens the database connection. Model initialization waits for indexes, including the unique email index, to be ready. The local launcher runs a real MongoDB process and stores development data on disk. Integration tests use a separate temporary database. .env.example is safe to commit, while .env is ignored because a real connection string may contain credentials.

## Slide 7: User and Product models

Simranjit: The User schema requires a name, email, and password. Email is normalized and has a unique index. Password hashing happens in the user controller, not in the schema. select:false excludes passwords from ordinary queries, and the JSON transform removes the password from responses including newly created records. Product requires a name and nonnegative price. Stock must be a nonnegative integer. Both models use timestamps. The slide shows an exact excerpt from each schema.

## Slide 8: Routes select the operation

Christian: These are exact route declarations. app.js mounts this router at /api/users. The collection path supports POST and GET. The /:id path supports GET, PUT, and DELETE. validateId runs before any operation on a specific record. validateBody checks permitted fields and required values. The project uses PUT to update supplied fields and preserves omitted fields, following the activity convention. Product routes use the same structure under /api/products.

## Slide 9: The controller saves the change

Christian: This excerpt is from the reusable CRUD controller. find loads the record or returns a 404 error. prepare handles resource-specific work, such as hashing a new password for users. Object.assign applies the permitted submitted fields. resource.save runs Mongoose validation and persists the updated document. The controller then returns JSON. Both resource types share the same CRUD behavior, avoiding repeated code.

## Slide 10: Create a user: 201 Created

Christian: Point first to POST /api/users and 201 Created in the screenshot. The request included name, email, password, and role. The response contains an ID and timestamps, but no password. A successful response alone is one piece of evidence. The following read and update tests check persistence. This screenshot belongs to the archived request screenshot run, whose raw results are saved separately from the latest aggregate test run. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 11: Read users: 200 OK

Christian: A GET request retrieves records without changing them. Point to the returned array and the saved user. The list endpoint supports page and limit parameters, with a maximum of 100 records per page. To retrieve a single user, use GET /api/users/:id. The same ID links the create, read, update, and delete operations. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 12: Update a user: 200 OK

Christian: PUT sends the changed name to the URL containing the existing user ID. Point to the updated name and the unchanged ID. The collection includes another GET request to verify the new name remained in MongoDB. The server applies only supplied editable fields. It does not create a second user when updating an existing user. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 13: Delete a user: 200 OK

Christian: DELETE removes the document matching the URL ID. The JSON response contains User deleted and the same ID. A success message alone does not fully prove deletion, so the next request asks for that same record again. This distinction is useful when explaining why we test a sequence of requests. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 14: A second read confirms deletion

Christian: The 404 is expected here. The test passes because the deleted user should no longer exist. A successful test does not always mean HTTP 200. It means the response matches the intended behavior. This completes the user CRUD sequence and demonstrates persistence of the deletion. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 15: Products use the same CRUD pattern

Simranjit: The second model demonstrates that the structure handles another resource. Products use /api/products and the same CRUD controller factory. They have different field rules: price must be nonnegative, and stock must be a nonnegative integer. The screenshot shows the created product response. The collection also reads and deletes the product, then confirms it is missing. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 16: Product changes persist

Simranjit: Point to price 50 and stock 8 in the response. This updates the existing product rather than creating a new item. The Postman collection checks the update through another GET request. The console demo repeats the product create, read, update, delete, and read-after-delete sequence. This lets us demonstrate both models during the live session. These are cropped sections of the saved Newman HTML report. The full screenshot remains in docs/evidence. The HTML report is a testing tool interface. The submitted application serves JSON through the backend.

## Slide 17: Recorded test results

Bea: These figures describe the saved completed runs. The integration test log contains 37 passing tests with zero failures. The Newman run executed 20 requests and 52 assertions with zero failures. An assertion checks a condition such as the response status or a field value, so one request can have several assertions. The report screenshot is generated by Newman using the Postman collection. Its colored interface belongs to the reporting tool. It is evidence of the backend, not an application frontend.

## Slide 18: Validation and error handling

Christian: Explain a few failure cases and show their tests. Missing or invalid values produce 400. Duplicate emails produce 409 because the database unique index prevents the second record. A valid ID with no matching record produces 404. Oversized JSON produces 413. The health route reports 503 when the database is disconnected. The middleware translates errors into consistent JSON messages. Passwords are hashed with scrypt and a fresh salt, but the project does not implement login or permission enforcement. The role field only stores data.

## Slide 19: GitHub walkthrough

Karl: Open the repository link in this slide. Start at README so the professor sees the purpose, setup, and submission links. Open backend/server.js, then app.js, routes/userRoutes.js, controllers/crudController.js, models/User.js, and config/db.js. Explain how the files connect rather than reading every line. Then open docs/Lab_Report.md and docs/evidence. Finally open the commit history. GitHub stores source files and documentation. It does not run this local API simply because the repository is open. The guide contains clickable links for each step.

## Slide 20: Commits show the project history

Karl: Open the commits page and select a meaningful change. 3b5c316 contains the modular backend. 2e5ade4 adds tests and the Postman collection. 4bedd9e finalizes the backend report and actual output. The account used to push is kjamesss. The history contains an earlier frontend experiment and its later removal. If asked, explain that the current submission follows the backend activity scope, and the normal Git history preserves the earlier change. Do not say each group member separately authored commits when the history shows the GitHub Manager account.

## Slide 21: Local demonstration setup

Karl: Before class, clone or download the repository, install Node.js 22 or later, run npm ci, and create .env from the example if it does not exist. Run the commands from backend. Terminal 1 keeps MongoDB running. Skip that launcher if you already have a working local MongoDB service using the same connection. Terminal 2 starts Express. Terminal 3 sends requests. Complete the first database download before class because it needs internet. Never close the database or server terminals while demonstrating. These instructions also appear in the guide.

## Slide 22: Live backend demonstration

Christian: Run npm run demo in the third terminal. It sends actual HTTP requests to http://127.0.0.1:5000. Pause at health and explain database: connected. Follow the user ID from create through read and update, then deletion and 404. Repeat the product sequence. The script checks expected status codes, prints actual JSON, and removes its two sample records. It uses a unique email each run. The values and IDs in a new run will differ from the saved screenshots. The guide includes individual PowerShell requests if the professor wants a slower, manual demonstration.

## Slide 23: Postman demonstration

Christian: In Postman, import the collection and Local environment from docs/postman. Select the local environment and keep MongoDB and Express running. Run the collection in its numbered order. Its scripts save IDs automatically for later requests. If the professor wants to inspect individual requests, show the method, URL, JSON body, response, and tests. Alternatively npm run test:postman runs the same collection through Newman. Explain why expected failure responses can still have passing assertions. The HTML report is saved locally and can be opened in a browser.

## Slide 24: Presentation responsibilities

Bea: These are the assigned project roles and suggested speaking parts. Each member should review the actual files before presenting and explain only what they understand. I introduce the activity and evidence. Christian explains routes, controllers, and the live requests. Simranjit explains MongoDB, schemas, and persistence. Karl navigates GitHub, setup instructions, and commit history. These responsibilities follow the group roles in the report.

## Slide 25: What the activity demonstrates

Bea: Close by connecting the evidence to the requirements. The modular backend is visible in the source structure. The health response and database-backed tests demonstrate MongoDB integration. The user and product sequences demonstrate CRUD. GitHub includes the README, report, collection, screenshots, and commits. Invite the professor to choose a route or file for explanation. The next two slides are references for questions and troubleshooting rather than required parts of the main talk.

## Slide 26: Questions your professor may ask

Reference slide. Why split routes and controllers? Routes describe endpoints, while controllers perform the operation. Why Mongoose? It supplies schemas, validation, and model methods used by this backend. How do you know a change persisted? Send another GET after PUT, and expect 404 after DELETE. Is the green report a frontend? It is a Newman testing report. Does role admin grant permissions? No. There is no authorization layer in this phase. Why does the screenshot differ from a new run? IDs, emails, timestamps, and timings change between runs. The saved evidence records a completed run.

## Slide 27: Demo recovery

Reference slide. If a request fails to connect, check that MongoDB and the API are still running. If the API reports startup failed, check MONGO_URI and the database terminal. EADDRINUSE means a port is already occupied, so use the existing intended service or stop your duplicate process. If a user POST returns 409, use a new demonstration email. If packages or the MongoDB binary are unavailable, complete setup with internet before class. If live demonstration is unavailable, explicitly show the saved backend-demo.txt and test evidence as a previous run. Do not describe saved output as a live result.
