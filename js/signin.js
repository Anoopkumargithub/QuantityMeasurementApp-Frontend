import { authService } from "./auth.js";

const signInForm = document.getElementById("signInForm");
const statusElement = document.getElementById("authStatus");

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("status-error", isError);
  statusElement.classList.toggle("status-success", !isError);
}

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signInForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    setStatus("Email and password are required.", true);
    return;
  }

  try {
    setStatus("Signing in...");
    await authService.signIn(email, password);
    setStatus("Sign in successful. Redirecting...");
    window.location.href = "./index.html";
  } catch (error) {
    setStatus(error.message || "Unable to sign in.", true);
  }
});

authService.onAuthChanged((user) => {
  if (user) {
    window.location.href = "./index.html";
  }
});
