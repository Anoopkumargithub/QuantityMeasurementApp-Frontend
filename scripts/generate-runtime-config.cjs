const fs = require("fs");
const path = require("path");

require("dotenv").config();

const outputDir = path.resolve(__dirname, "..", "dist");
const outputFile = path.join(outputDir, "runtime.config.js");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  appId: process.env.FIREBASE_APP_ID || ""
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseKeys.length > 0) {
  throw new Error(
    "Missing required environment variables: " +
      missingFirebaseKeys.map((key) => "FIREBASE_" + key.replace(/([A-Z])/g, "_$1").toUpperCase()).join(", ")
  );
}

const rawApiBaseUrl = process.env.API_BASE_URL || "http://localhost:5044/api/QuantityMeasurement";

function normalizeApiBaseUrl(url) {
  const trimmed = String(url).replace(/\/+$/, "");
  if (/\/api\/QuantityMeasurement$/i.test(trimmed)) {
    return trimmed;
  }

  return trimmed + "/api/QuantityMeasurement";
}

const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);

if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(apiBaseUrl)) {
  throw new Error("API_BASE_URL points to localhost in production. Set API_BASE_URL to your deployed backend URL.");
}

const content = `app.constant("FIREBASE_CONFIG", ${JSON.stringify(firebaseConfig, null, 2)});
app.constant("API_BASE_URL", ${JSON.stringify(apiBaseUrl)});
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, content, "utf8");

console.log("Wrote " + path.relative(process.cwd(), outputFile));