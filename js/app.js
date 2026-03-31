import { authService } from "./auth.js";
import { createApiClient } from "./api.js";
import { ACTIONS, ARITHMETIC_OPERATIONS, UNIT_MAP } from "./constants.js";

class QuantityMeasurementUI {
  constructor() {
    this.currentType = "Length";
    this.currentAction = ACTIONS.Comparison;
    this.currentArithmeticOperation = ARITHMETIC_OPERATIONS.Add;
    this.apiClient = createApiClient(() => authService.getIdToken());

    this.elements = {
      typeButtons: Array.from(document.querySelectorAll("[data-type]")),
      actionButtons: Array.from(document.querySelectorAll("[data-action]")),
      arithmeticSelect: document.getElementById("arithmeticOperation"),
      firstValue: document.getElementById("firstValue"),
      firstUnit: document.getElementById("firstUnit"),
      secondValue: document.getElementById("secondValue"),
      secondUnit: document.getElementById("secondUnit"),
      resultBlock: document.getElementById("resultBlock"),
      resultText: document.getElementById("resultText"),
      statusText: document.getElementById("statusText"),
      runButton: document.getElementById("runActionButton"),
      logoutButton: document.getElementById("logoutButton"),
      userEmail: document.getElementById("userEmail"),
      secondCard: document.getElementById("secondInputCard")
    };

    this.wireEvents();
    this.syncUnitOptions();
    this.syncVisibleInputs();
  }

  wireEvents() {
    this.elements.typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.currentType = button.dataset.type;
        this.renderTypeSelection();
        this.syncUnitOptions();
      });
    });

    this.elements.actionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.currentAction = button.dataset.action;
        this.renderActionSelection();
        this.syncVisibleInputs();
      });
    });

    this.elements.arithmeticSelect.addEventListener("change", () => {
      this.currentArithmeticOperation = this.elements.arithmeticSelect.value;
    });

    this.elements.runButton.addEventListener("click", () => {
      this.handleAction().catch((error) => {
        this.setStatus(error.message || "Unable to complete operation.", true);
      });
    });

    this.elements.logoutButton.addEventListener("click", async () => {
      try {
        await authService.signOut();
      } finally {
        window.location.href = "./signin.html";
      }
    });
  }

  renderTypeSelection() {
    this.elements.typeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.type === this.currentType);
    });
  }

  renderActionSelection() {
    this.elements.actionButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.action === this.currentAction);
    });
  }

  syncUnitOptions() {
    const units = UNIT_MAP[this.currentType];

    this.elements.firstUnit.innerHTML = "";
    this.elements.secondUnit.innerHTML = "";

    units.forEach((unit) => {
      this.elements.firstUnit.append(this.createOption(unit));
      this.elements.secondUnit.append(this.createOption(unit));
    });

    this.elements.firstUnit.value = units[0];
    this.elements.secondUnit.value = units[Math.min(1, units.length - 1)] || units[0];
  }

  syncVisibleInputs() {
    const isConversion = this.currentAction === ACTIONS.Conversion;

    this.elements.secondCard.classList.toggle("target-only", isConversion);
    this.elements.secondValue.disabled = isConversion;
    this.elements.arithmeticSelect.parentElement.classList.toggle(
      "is-hidden",
      this.currentAction !== ACTIONS.Arithmetic
    );
  }

  createOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    return option;
  }

  setStatus(message, isError = false) {
    this.elements.statusText.textContent = message;
    this.elements.statusText.classList.toggle("status-error", isError);
    this.elements.statusText.classList.toggle("status-success", !isError);
  }

  showResult(value) {
    this.elements.resultText.textContent = String(value);
    this.elements.resultBlock.classList.remove("is-hidden");
  }

  getFirstQuantity() {
    return {
      value: Number(this.elements.firstValue.value),
      unit: this.elements.firstUnit.value,
      measurementType: this.currentType
    };
  }

  getSecondQuantity() {
    return {
      value: Number(this.elements.secondValue.value),
      unit: this.elements.secondUnit.value,
      measurementType: this.currentType
    };
  }

  validateInput(value, label) {
    if (Number.isNaN(value) || !Number.isFinite(value)) {
      throw new Error(`${label} must be a valid number.`);
    }
  }

  async handleAction() {
    const first = this.getFirstQuantity();
    this.validateInput(first.value, "First value");

    this.setStatus("Processing...");

    if (this.currentAction === ACTIONS.Comparison) {
      const second = this.getSecondQuantity();
      this.validateInput(second.value, "Second value");

      const response = await this.apiClient.compare(first, second);
      this.showResult(response.data ? "Equal" : "Not Equal");
      this.setStatus(response.message);
      return;
    }

    if (this.currentAction === ACTIONS.Conversion) {
      const response = await this.apiClient.convert(first, this.elements.secondUnit.value);
      this.showResult(`${response.data.value} ${response.data.unit}`);
      this.setStatus(response.message);
      return;
    }

    if (this.currentAction === ACTIONS.Arithmetic) {
      const second = this.getSecondQuantity();
      this.validateInput(second.value, "Second value");

      if (this.currentArithmeticOperation === ARITHMETIC_OPERATIONS.Add) {
        const response = await this.apiClient.add(first, second, this.elements.firstUnit.value);
        this.showResult(`${response.data.value} ${response.data.unit}`);
        this.setStatus(response.message);
        return;
      }

      if (this.currentArithmeticOperation === ARITHMETIC_OPERATIONS.Subtract) {
        const response = await this.apiClient.subtract(first, second, this.elements.firstUnit.value);
        this.showResult(`${response.data.value} ${response.data.unit}`);
        this.setStatus(response.message);
        return;
      }

      const response = await this.apiClient.divide(first, second);
      this.showResult(response.data);
      this.setStatus(response.message);
      return;
    }

    throw new Error("Unsupported action selected.");
  }
}

function startApp() {
  authService.onAuthChanged((user) => {
    if (!user) {
      window.location.href = "./signin.html";
      return;
    }

    document.getElementById("userEmail").textContent = user.email || "Authenticated User";
    const app = new QuantityMeasurementUI();
    app.setStatus("Ready. Choose values and run an operation.");
  });
}

startApp();
