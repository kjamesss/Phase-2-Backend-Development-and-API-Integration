# Phase 2 Backend Development and API Integration

IS Elec 2 - Web Systems and Technologies

**Group:** Phase 2 Backend Team  
**Project:** User and Product Management API  
**GitHub Manager:** Karl James Matias, account [kjamesss](https://github.com/kjamesss)

This project implements a Node.js and Express REST API with Mongoose models and a working MongoDB connection. The activity title is **Phase 2**, correcting the Phase 3 typo in the supplied handout.

## Run locally

Requires Node.js 22 or later and MongoDB. See [backend setup and API reference](backend/README.md) for the full instructions.

```powershell
cd backend
npm ci
Copy-Item .env.example .env
# Terminal 1: optional local MongoDB launcher
npm run db:local
# Terminal 2: from backend
npm start
# Terminal 3: demonstrate HTTP requests and JSON responses
npm run demo
```

For macOS or Linux, use `cp .env.example .env`. If MongoDB is already running, skip `db:local`. MongoDB Atlas also works by setting `MONGO_URI` in the ignored `.env` file.

## Submission contents

- [Backend source and setup](backend/README.md)
- [Lab report](docs/Lab_Report.md)
- [PDF lab report](docs/Phase_2_Lab_Report.pdf)
- [Postman collection](docs/postman/Phase2.postman_collection.json) and [local environment](docs/postman/Local.postman_environment.json)
- [Testing evidence](docs/evidence)
- [Rubric evidence checklist](docs/Rubric_Checklist.md)
- [Commit record](docs/GitHub_Commits.md)

## Group roles

| Member | Assigned role |
| --- | --- |
| Bea Roshan Pabilona | Project Manager and Documentation Officer |
| Christian Balauro | Backend Developer |
| Simranjit Singh | Database Manager |
| Karl James Matias | GitHub Manager using `kjamesss` |

The role descriptions identify each member's responsibility for reviewing and maintaining the submitted work.

This coursework API binds to the local computer. Authentication and permission checks are reserved for a later phase. The `role` field stores data and does not grant access rights.
