# QuantityMeasurementApp Frontend

This frontend is connected to `QuantityMeasurement.Api` and uses Firebase Authentication.

## Tech Stack

- HTML5 semantic structure
- CSS3 (flexbox, grid, float usage, media queries, pseudo classes, complex selectors, responsive layout)
- Vanilla JavaScript (ES9 classes, objects, async/await, promises, callbacks, DOM manipulation, form handling, event handling, conditional logic, exception handling)
- AJAX via `fetch`
- Dynamic UI rendering
- Firebase Authentication (Email/Password)

## Project Structure

- `index.html`: Main quantity measurement app (protected page)
- `signin.html`: Sign-in UI
- `signup.html`: Sign-up UI
- `css/styles.css`: Complete styling and responsive behavior
- `js/app.js`: Main dashboard logic and API calls
- `js/signin.js`: Sign-in page logic
- `js/signup.js`: Sign-up page logic
- `js/auth.js`: Auth service class
- `js/api.js`: API client wrapper for protected backend endpoints
- `js/firebase.js`: Firebase bootstrap
- `config/firebase-config.js`: Firebase web config (already set for project `quantitymeasurementapp-6c764`)
- `config/app-config.js`: API base URL configuration

## Firebase Console Setup

1. Open Firebase Console.
2. Select project: `quantitymeasurementapp-6c764`.
3. Go to `Authentication` -> `Sign-in method`.
4. Enable `Email/Password` provider.
5. Go to `Project settings` -> `General` -> `Your apps` and verify web app config in `config/firebase-config.js`.
6. In `Authentication` -> `Settings` -> `Authorized domains`, add the domain you use to host this frontend (for local server this is typically `localhost`).

## Backend Setup

1. Start API from:
	- `QuantityMeasurementApp/QuantityMeasurementSolution/QuantityMeasurement.Api`
2. Run:

```powershell
dotnet run
```

The default HTTP URL used by this frontend is:

- `http://localhost:5044/api/QuantityMeasurement`

If your backend runs elsewhere, update `config/app-config.js`.

## Run Frontend

Serve frontend with any static server from `QuantityMeasurementApp-Frontend-`.

Example using VS Code Live Server extension, or:

```powershell
python -m http.server 5500
```

Then open:

- `http://localhost:5500/signin.html`

## Authentication and API Flow

1. User signs up/signs in with Firebase Email/Password.
2. Firebase returns ID token.
3. Frontend attaches token as `Authorization: Bearer <token>`.
4. Backend validates token against Firebase project ID and processes request.

## Supported Operations

- Comparison: `/compare`
- Conversion: `/convert`
- Arithmetic Add: `/add`
- Arithmetic Subtract: `/subtract`
- Arithmetic Divide: `/divide`

All endpoints are protected with `[Authorize]`.