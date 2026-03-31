app.factory("AuthInterceptor", function ($q, AuthService) {
  function isProtectedApiRequest(url) {
    if (!url || typeof url !== "string") {
      return false;
    }

    return url.indexOf("/api/QuantityMeasurement") !== -1;
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
