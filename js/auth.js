import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./firebase.js";

export class AuthService {
  constructor(firebaseAuth) {
    this.auth = firebaseAuth;
  }

  async signIn(email, password) {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async signUp(email, password) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    return credential.user;
  }

  async signOut() {
    await signOut(this.auth);
  }

  onAuthChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  async getIdToken(forceRefresh = false) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("No authenticated user found.");
    }

    return user.getIdToken(forceRefresh);
  }
}

export const authService = new AuthService(auth);
