# Frontend setup and demonstration

The frontend uses plain HTML, CSS, and JavaScript. Express serves it from the same address as the backend, so every action reaches the real MongoDB database through the API.

## Files

| File | Purpose |
| --- | --- |
| index.html | User and product forms, record tables, deletion dialog, and API response panel |
| styles.css | Simple light layout with a stacked layout on smaller screens |
| app.js | Fetch requests, form handling, table rendering, search, pagination, and feedback |

## Run

Follow the [backend setup](../backend/README.md), start MongoDB, then run `npm start` from `backend`. Open [http://127.0.0.1:5000](http://127.0.0.1:5000). Opening `index.html` directly from the file system will not connect the relative API paths correctly.

## Demonstrate user CRUD

1. Open **Users**. Enter a name, a `.test` email address, and a sample password of 8 or more characters.
2. Select **Create user**. The record appears in the table and the API panel shows HTTP 201.
3. Reload the page. The record is read from MongoDB and remains visible.
4. Select **Edit**, change the name, and select **Save changes**. The API panel shows HTTP 200. Leave the password blank to preserve the current password.
5. Select **Delete**. Cancel once to demonstrate that the record is preserved, then confirm deletion. The row disappears and the API panel shows the deletion response.

## Demonstrate product CRUD

1. Open **Products** and create `Lab Notebook` with price `45.50` and stock `10`.
2. Select **Edit**, set price to `50.00` and stock to `8`, then save.
3. Reload the page, reopen **Products**, and verify the saved values.
4. Delete the product and confirm that its row disappears.

Search filters the current page. Previous and Next load pages of 10 records from the backend. An empty search result is shown clearly. HTML form rules catch incomplete values, while the backend validates every request independently. A duplicate email returns an HTTP 409 message in the page.

## API integration code

The shared function in `app.js` sends requests and reads JSON:

```javascript
const response = await fetch(path, {
  ...options,
  headers: { 'Content-Type': 'application/json', ...options.headers }
});
const data = await response.json();
```

Creating and editing a record use the same form and function:

```javascript
const path = `/api/${state.resource}${editing ? '/' + state.editId : ''}`;
await api(path, {
  method: editing ? 'PUT' : 'POST',
  body: JSON.stringify(body)
});
```

Deleting a record uses its saved MongoDB ID:

```javascript
await api(`/api/${state.resource}/${record._id}`, { method: 'DELETE' });
```

Names and other database values are inserted with `textContent`, which keeps them as text. Passwords are sent only when needed and are never displayed in the API response panel. No browser-only sample data store is used.

## Browser evidence

The screenshots and [browser check record](../docs/evidence/frontend/browser-checks.json) document actual actions against the local backend. They include create, update, reload persistence, duplicate email feedback, cancellation of deletion, search, and deletion for both resources. See the [lab report](../docs/Lab_Report.md) for backend and frontend snippets and results.
