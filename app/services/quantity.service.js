app.service("QuantityService", function ($http) {
  var BASE_URL = "http://localhost:5044/api/QuantityMeasurement";

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