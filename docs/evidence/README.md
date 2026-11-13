# API testing evidence

The screenshots show actual request and response results from a Postman collection executed with Newman, Postman's command-line collection runner. They are screenshots of the generated results report, not the Postman desktop interface. The API was backed by a real local MongoDB process.

| Evidence | Content |
| --- | --- |
| 01-postman-summary.jpg | Complete test report summary in light mode |
| 01b-postman-summary-table.jpg | Readable crop of the original summary table |
| 02-user-create.jpg | POST user, HTTP 201 |
| 03-user-read.jpg | GET users, HTTP 200 |
| 04-user-update.jpg | PUT user, HTTP 200 |
| 05-user-delete.jpg | DELETE user, HTTP 200 |
| 06-user-deletion-confirmed.jpg | GET deleted user, HTTP 404 |
| 07-product-create.jpg | POST product, HTTP 201 |
| 08-product-read.jpg | GET products, HTTP 200 |
| 09-product-update.jpg | PUT product, HTTP 200 |
| 10-product-delete.jpg | DELETE product, HTTP 200 |
| integration-tests.tap | 37 passing database-backed integration tests |
| newman-results.json | Original machine-readable result with all requests and responses |
| postman-run.txt | Command-line result with 20 requests and 52 passing assertions |
| postman-test-report.html | Generated interactive results report with light presentation |
| backend-demo.txt | Actual console demonstration of user and product CRUD |
| runtime-audit.json | Zero runtime dependency vulnerabilities reported on the test date |

Screenshots were cropped to the relevant request sections for readability. Cropping does not change the response content. The raw Newman JSON and HTML report retain the full requests and responses. Some long JSON lines in the narrow report viewport require horizontal scrolling in the HTML report; use the original JSON or text transcript for complete values.

Run `npm run test:postman` from `backend` while MongoDB and Express are running to generate a fresh report. Later runs will have new IDs and timestamps. Run `npm run demo` to demonstrate the backend directly without a frontend. All test records use fictional data and `.test` email addresses.
