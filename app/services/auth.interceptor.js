app.factory("AuthInterceptor", function ($q, AuthService, API_BASE_URL) {
  function normalizeBaseUrl(url) {
    var fallback = "http://localhost:5044/api/QuantityMeasurement";
    var value = (url || fallback).replace(/\/+$/, "");

    if (!/\/api\/QuantityMeasurement$/i.test(value)) {
      value += "/api/QuantityMeasurement";
    }

    return value;
  }

  var normalizedApiBaseUrl = normalizeBaseUrl(API_BASE_URL);

  function isProtectedApiRequest(url) {
    if (!url || typeof url !== "string") {
      return false;
    }

    return url.indexOf(normalizedApiBaseUrl) === 0;
  }

  return {
    request: function (config) {
      if (!isProtectedApiRequest(config.url)) {
        return config;
      }

      return AuthService.getIdToken()
        .then(function (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = "Bearer " + token;
          return config;
        })
        .catch(function () {
          return config;
        });
    },

    responseError: function (rejection) {
      return $q.reject(rejection);
    }
  };
});
