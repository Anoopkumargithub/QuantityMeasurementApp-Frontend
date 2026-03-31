app.controller("QuantityController", function ($scope, MEASUREMENT_CONFIG, QuantityService, AuthService) {
  $scope.loginForm = {
    email: "",
    password: ""
  };
  $scope.isAuthenticated = false;
  $scope.currentUserEmail = "";
  $scope.authLoading = false;
  $scope.authErrorMessage = "";

  function updateAuthState(user) {
    $scope.$applyAsync(function () {
      $scope.isAuthenticated = !!user;
      $scope.currentUserEmail = user && user.email ? user.email : "";

      if (!user) {
        $scope.result = null;
      }
    });
  }

  var unsubscribeAuth = AuthService.onAuthStateChanged(updateAuthState);

  $scope.$on("$destroy", function () {
    if (typeof unsubscribeAuth === "function") {
      unsubscribeAuth();
    }
  });

  $scope.login = function () {
    $scope.authErrorMessage = "";

    if (!$scope.loginForm.email || !$scope.loginForm.password) {
      $scope.authErrorMessage = "Please enter email and password.";
      return;
    }

    $scope.authLoading = true;

    AuthService.signIn($scope.loginForm.email, $scope.loginForm.password)
      .catch(function (error) {
        $scope.$applyAsync(function () {
          $scope.authErrorMessage = (error && error.message)
            ? error.message
            : "Login failed.";
        });
      })
      .finally(function () {
        $scope.$applyAsync(function () {
          $scope.authLoading = false;
        });
      });
  };

  $scope.loginWithGoogle = function () {
    $scope.authErrorMessage = "";
    $scope.authLoading = true;

    AuthService.signInWithGoogle()
      .catch(function (error) {
        $scope.$applyAsync(function () {
          $scope.authErrorMessage = (error && error.message)
            ? error.message
            : "Google sign-in failed.";
        });
      })
      .finally(function () {
        $scope.$applyAsync(function () {
          $scope.authLoading = false;
        });
      });
  };

  $scope.logout = function () {
    $scope.authLoading = true;
    $scope.authErrorMessage = "";

    AuthService.signOut()
      .catch(function (error) {
        $scope.$applyAsync(function () {
          $scope.authErrorMessage = (error && error.message)
            ? error.message
            : "Logout failed.";
        });
      })
      .finally(function () {
        $scope.$applyAsync(function () {
          $scope.authLoading = false;
        });
      });
  };

  $scope.measurementTypes = MEASUREMENT_CONFIG.measurementTypes;
  $scope.operations = MEASUREMENT_CONFIG.operations;
  $scope.unitsMap = MEASUREMENT_CONFIG.units;

  $scope.form = {
    measurementType: "",
    operation: "",
    firstQuantity: {
      value: null,
      unit: ""
    },
    secondQuantity: {
      value: null,
      unit: ""
    },
    targetUnit: ""
  };

  $scope.availableUnits = [];
  $scope.result = null;
  $scope.errorMessage = "";
  $scope.loading = false;

  $scope.onMeasurementTypeChange = function () {
    var selectedType = $scope.form.measurementType;
    $scope.availableUnits = $scope.unitsMap[selectedType] || [];

    $scope.form.operation = "";
    $scope.form.firstQuantity = { value: null, unit: "" };
    $scope.form.secondQuantity = { value: null, unit: "" };
    $scope.form.targetUnit = "";
    $scope.result = null;
    $scope.errorMessage = "";
  };

  $scope.onOperationChange = function () {
    $scope.form.firstQuantity = { value: null, unit: "" };
    $scope.form.secondQuantity = { value: null, unit: "" };
    $scope.form.targetUnit = "";
    $scope.result = null;
    $scope.errorMessage = "";
  };

  $scope.requiresSecondQuantity = function () {
    return ["compare", "add", "addWithTarget", "subtract", "divide"].includes($scope.form.operation);
  };

  $scope.requiresTargetUnit = function () {
    return ["convert", "addWithTarget"].includes($scope.form.operation);
  };

  $scope.isTemperatureOperationAllowed = function () {
    if ($scope.form.measurementType !== "Temperature") {
      return true;
    }

    return ["compare", "convert"].includes($scope.form.operation);
  };

  $scope.resetForm = function () {
    $scope.form = {
      measurementType: "",
      operation: "",
      firstQuantity: {
        value: null,
        unit: ""
      },
      secondQuantity: {
        value: null,
        unit: ""
      },
      targetUnit: ""
    };

    $scope.availableUnits = [];
    $scope.result = null;
    $scope.errorMessage = "";
    $scope.loading = false;
  };

  $scope.validateForm = function () {
    if (!$scope.form.measurementType) {
      return "Please select measurement type.";
    }

    if (!$scope.form.operation) {
      return "Please select operation.";
    }

    if ($scope.form.firstQuantity.value === null || $scope.form.firstQuantity.value === undefined) {
      return "Please enter first value.";
    }

    if (!$scope.form.firstQuantity.unit) {
      return "Please select first unit.";
    }

    if ($scope.requiresSecondQuantity()) {
      if ($scope.form.secondQuantity.value === null || $scope.form.secondQuantity.value === undefined) {
        return "Please enter second value.";
      }

      if (!$scope.form.secondQuantity.unit) {
        return "Please select second unit.";
      }
    }

    if ($scope.requiresTargetUnit() && !$scope.form.targetUnit) {
      return "Please select target unit.";
    }

    if (!$scope.isTemperatureOperationAllowed()) {
      return "Selected operation is not allowed for temperature.";
    }

    return "";
  };

  $scope.buildQuantity = function (quantity) {
    return {
      value: Number(quantity.value),
      unit: quantity.unit,
      measurementType: $scope.form.measurementType
    };
  };

  $scope.buildPayload = function () {
    switch ($scope.form.operation) {
      case "compare":
        return {
          firstQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          secondQuantity: $scope.buildQuantity($scope.form.secondQuantity)
        };

      case "convert":
        return {
          sourceQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          targetUnit: $scope.form.targetUnit
        };

      case "add":
        return {
          firstQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          secondQuantity: $scope.buildQuantity($scope.form.secondQuantity),
          targetUnit: ""
        };

      case "addWithTarget":
        return {
          firstQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          secondQuantity: $scope.buildQuantity($scope.form.secondQuantity),
          targetUnit: $scope.form.targetUnit
        };

      case "subtract":
        return {
          firstQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          secondQuantity: $scope.buildQuantity($scope.form.secondQuantity),
          targetUnit: ""
        };

      case "divide":
        return {
          firstQuantity: $scope.buildQuantity($scope.form.firstQuantity),
          secondQuantity: $scope.buildQuantity($scope.form.secondQuantity),
          targetUnit: ""
        };

      default:
        return null;
    }
  };

  $scope.callApi = function (payload) {
    switch ($scope.form.operation) {
      case "compare":
        return QuantityService.compare(payload);

      case "convert":
        return QuantityService.convert(payload);

      case "add":
      case "addWithTarget":
        return QuantityService.add(payload);

      case "subtract":
        return QuantityService.subtract(payload);

      case "divide":
        return QuantityService.divide(payload);

      default:
        return Promise.reject("Invalid operation");
    }
  };

  $scope.calculate = function () {
    if (!$scope.isAuthenticated) {
      $scope.errorMessage = "Please sign in to access protected API endpoints.";
      return;
    }

    $scope.errorMessage = "";
    $scope.result = null;

    var validationMessage = $scope.validateForm();
    if (validationMessage) {
      $scope.errorMessage = validationMessage;
      return;
    }

    var payload = $scope.buildPayload();
    $scope.loading = true;

    $scope.callApi(payload)
      .then(function (response) {
        $scope.result = response.data;
      })
      .catch(function (error) {
        if (error && error.status === 401) {
          $scope.errorMessage = "Unauthorized. Please sign in again.";
          return;
        }

        if (error && error.data && error.data.message) {
          $scope.errorMessage = error.data.message;
        } else {
          $scope.errorMessage = "Something went wrong while calling the API.";
        }
      })
      .finally(function () {
        $scope.loading = false;
      });
  };

  $scope.isBooleanResult = function () {
    return $scope.result && typeof $scope.result.data === "boolean";
  };

  $scope.isNumericResult = function () {
    return $scope.result && typeof $scope.result.data === "number";
  };

  $scope.isObjectResult = function () {
    return $scope.result && $scope.result.data && typeof $scope.result.data === "object";
  };
});