# QuantityMeasurementApp-Frontend

## Branch: Feature/UC20-Angular-Frontend-for-Quantity-Measurement

A modern AngularJS-based frontend for the Quantity Measurement application with Firebase authentication and comprehensive quantity operation features.

## Overview

This branch implements a user-friendly web interface to perform various quantity measurement operations. It includes user authentication via Firebase and supports operations like comparing, converting, adding, subtracting, and dividing different quantities.

## Features

- **User Authentication**: Firebase-based signup and login functionality
- **Quantity Operations**:
  - Compare quantities
  - Convert between different units
  - Add quantities
  - Subtract quantities
  - Divide quantities
- **Responsive Design**: Built with Tailwind CSS for mobile-friendly interface
- **Auth Interceptor**: Automatic authentication handling for API calls
- **Real-time Authentication State Management**

## Tech Stack

- **Frontend Framework**: AngularJS 1.8.2
- **Authentication**: Firebase Authentication (v10.12.2)
- **Styling**: Tailwind CSS (v4.2.1)
- **Icons**: Font Awesome 6.5.2
- **CSS Processor**: Tailwind CSS CLI
- **Development Server**: Live Server
- **Backend API**: ASP.NET WebAPI (localhost:5044)

## Prerequisites

- Node.js (v14 or higher)
- npm package manager
- Modern web browser

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd QuantityMeasurementApp-Frontend
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

### Development Mode

Open two terminal windows/tabs in the project root:

**Terminal 1 - Watch CSS changes:**

```bash
npm run dev
```

**Terminal 2 - Start Live Server:**

```bash
npm run serve
```

The application will open in your browser at `http://127.0.0.1:8080`

## Environment Variables

Create a local `.env` file in the repository root and set these values:

```bash
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_APP_ID=your_app_id
API_BASE_URL=http://localhost:5044/api/QuantityMeasurement
```

Render uses the same variable names in the service settings, so you do not need to commit secrets to the repo.

## Project Structure

```
.
├── index.html                      # Main application page
├── signup.html                     # Signup page
├── package.json                    # Project dependencies
├── app/
│   ├── app.module.js              # AngularJS app initialization
│   ├── config/
│   │   ├── firebase.config.js     # Firebase configuration
│   │   └── measurement.config.js  # Measurement units configuration
│   ├── controllers/
│   │   ├── quantity.controller.js # Main quantity controller
│   │   └── signup.controller.js   # Signup controller
│   └── services/
│       ├── auth.service.js        # Firebase authentication service
│       ├── auth.interceptor.js    # HTTP auth interceptor
│       └── quantity.service.js    # Quantity API service
└── styles/
    └── input.css                  # Tailwind CSS input file
```

## API Endpoints

The application communicates with a backend API running on `http://localhost:5044/api/QuantityMeasurement`:

- `POST /compare` - Compare two quantities
- `POST /convert` - Convert quantity to another unit
- `POST /add` - Add two quantities
- `POST /subtract` - Subtract quantities
- `POST /divide` - Divide quantities

## Usage

1. **Sign Up**: Create a new account or sign up with Firebase credentials
2. **Log In**: Enter your email and password to authenticate
3. **Perform Operations**: Use the interface to select quantities and perform operations
4. **View Results**: See the calculated results displayed on the page

## Development Notes

- Ensure the backend API is running on port 5044 before starting the frontend, or set `API_BASE_URL` to your deployed API URL
- The auth interceptor automatically adds authentication tokens to API requests
- Tailwind CSS is built to `dist/output.css` with the `dev` or `build` script

## Render Deployment

Use Render as a Static Site.

- Root Directory: leave blank, or set it to `.`
- Build Command: `npm run build`
- Publish Directory: `.`

Add these environment variables in Render:

- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_APP_ID`
- `API_BASE_URL`

If your backend is also deployed on Render, set `API_BASE_URL` to the deployed API endpoint, for example `https://your-api.onrender.com/api/QuantityMeasurement`.

## License

ISC
