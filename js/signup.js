import { authService } from "./auth.js";

const signUpForm = document.getElementById("signUpForm");
const statusElement = document.getElementById("authStatus");

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("status-error", isError);
  statusElement.classList.toggle("status-success", !isError);
}

signUpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signUpForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const confirmPassword = String(formData.get("confirmPassword") || "").trim();

  if (!email || !password) {
    setStatus("Email and password are required.", true);
    return;
  }

  if (password.length < 6) {
    setStatus("Password must be at least 6 characters long.", true);
    return;
  }

  if (password !== confirmPassword) {
    setStatus("Password and confirm password do not match.", true);
    return;
  }

  try {
    setStatus("Creating account...");
    await authService.signUp(email, password);
    setStatus("Account created successfully. Redirecting...");
    window.location.href = "./index.html";
  } catch (error) {
    setStatus(error.message || "Unable to create account.", true);
  }
});

authService.onAuthChanged((user) => {
  if (user) {
    window.location.href = "./index.html";
  }
});
