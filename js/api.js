import { APP_CONFIG } from "../config/app-config.js";

export class QuantityApiClient {
  constructor(baseUrl, getToken) {
    this.baseUrl = baseUrl;
    this.getToken = getToken;
  }

  async request(path, payload, onSuccess) {
    const idToken = await this.getToken();

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: payload ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`
      },
      body: payload ? JSON.stringify(payload) : undefined
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "API request failed.");
    }

    if (typeof onSuccess === "function") {
      onSuccess(data);
    }

    return data;
  }

  compare(firstQuantity, secondQuantity, callback) {
    return this.request("/compare", { firstQuantity, secondQuantity }, callback);
  }

  convert(sourceQuantity, targetUnit, callback) {
    return this.request("/convert", { sourceQuantity, targetUnit }, callback);
  }

  add(firstQuantity, secondQuantity, targetUnit, callback) {
    return this.request("/add", { firstQuantity, secondQuantity, targetUnit }, callback);
  }

  subtract(firstQuantity, secondQuantity, targetUnit, callback) {
    return this.request("/subtract", { firstQuantity, secondQuantity, targetUnit }, callback);
  }

  divide(firstQuantity, secondQuantity, callback) {
    return this.request("/divide", { firstQuantity, secondQuantity }, callback);
  }

  health() {
    return this.request("/health");
  }
}

export function createApiClient(getToken) {
  return new QuantityApiClient(APP_CONFIG.apiBaseUrl, getToken);
}
