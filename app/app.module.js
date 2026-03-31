var app = angular.module("quantityApp", []);

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push("AuthInterceptor");
});