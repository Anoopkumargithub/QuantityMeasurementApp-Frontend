import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { firebaseConfig } from "../config/firebase-config.js";

function validateFirebaseConfig(config) {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  const missing = requiredKeys.filter((key) => {
    const value = config[key];
    return !value || value.startsWith("PASTE_");
  });

  if (missing.length) {
    throw new Error(
      `Firebase config is incomplete. Missing keys: ${missing.join(", ")}. Update config/firebase-config.js.`
    );
  }
}

validateFirebaseConfig(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
await setPersistence(auth, browserLocalPersistence);

export { auth, firebaseApp };
