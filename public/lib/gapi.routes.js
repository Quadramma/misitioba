var app = angular.module("qjarvisRoutes", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	$urlRouterProvider.otherwise('/'); //DEFAULT
});

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	

});