app.service("QuantityService", function ($http, API_BASE_URL) {
  function normalizeBaseUrl(url) {
    var fallback = "http://localhost:5044/api/QuantityMeasurement";
    var value = (url || fallback).replace(/\/+$/, "");

    if (!/\/api\/QuantityMeasurement$/i.test(value)) {
      value += "/api/QuantityMeasurement";
    }

    return value;
  }

  var BASE_URL = normalizeBaseUrl(API_BASE_URL);

  this.compare = function (payload) {
    return $http.post(BASE_URL + "/compare", payload);
  };

  this.convert = function (payload) {
    return $http.post(BASE_URL + "/convert", payload);
  };

  this.add = function (payload) {
    return $http.post(BASE_URL + "/add", payload);
  };

  this.subtract = function (payload) {
    return $http.post(BASE_URL + "/subtract", payload);
  };

  this.divide = function (payload) {
    return $http.post(BASE_URL + "/divide", payload);
  };
});