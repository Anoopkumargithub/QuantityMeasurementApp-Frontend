app.controller("SignupController", function ($scope, AuthService) {
  $scope.form = {
    email: "",
    password: "",
    confirmPassword: ""
  };

  $scope.loading = false;
  $scope.errorMessage = "";
  $scope.successMessage = "";

  $scope.createAccount = function () {
    $scope.errorMessage = "";
    $scope.successMessage = "";

    if (!$scope.form.email || !$scope.form.password || !$scope.form.confirmPassword) {
      $scope.errorMessage = "Please fill all fields.";
      return;
    }

    if ($scope.form.password.length < 6) {
      $scope.errorMessage = "Password must be at least 6 characters.";
      return;
    }

    if ($scope.form.password !== $scope.form.confirmPassword) {
      $scope.errorMessage = "Passwords do not match.";
      return;
    }

    $scope.loading = true;

    AuthService.signUp($scope.form.email, $scope.form.password)
      .then(function () {
        $scope.successMessage = "Account created successfully. Redirecting to app...";
        setTimeout(function () {
          window.location.href = "./index.html";
        }, 900);
      })
      .catch(function (error) {
        $scope.$applyAsync(function () {
          $scope.errorMessage = (error && error.message)
            ? error.message
            : "Failed to create account.";
        });
      })
      .finally(function () {
        $scope.$applyAsync(function () {
          $scope.loading = false;
        });
      });
  };

  $scope.continueWithGoogle = function () {
    $scope.errorMessage = "";
    $scope.successMessage = "";
    $scope.loading = true;

    AuthService.signInWithGoogle()
      .then(function () {
        window.location.href = "./index.html";
      })
      .catch(function (error) {
        $scope.$applyAsync(function () {
          $scope.errorMessage = (error && error.message)
            ? error.message
            : "Google sign-in failed.";
        });
      })
      .finally(function () {
        $scope.$applyAsync(function () {
          $scope.loading = false;
        });
      });
  };
});
