app = angular.module("routes", ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {


	$stateProvider.state('home', {
		url: '^/',
		templateUrl: 'app/views/home.html',
		controller: 'homeCtrl'
	});

	$stateProvider.state('contact', {
		url: '^/contacto',
		templateUrl: 'app/views/contact.html',
		controller: 'contactCtrl'
	});

	$stateProvider.state('aboutus', {
		url: '^/sobrenosotros',
		templateUrl: 'app/views/about.html'
	});

	$stateProvider.state('services', {
		url: '^/servicios',
		templateUrl: 'app/views/services.html',
		controller: 'servicesCtrl'
	});

	$stateProvider.state('budget', {
		url: '^/presupuesto',
		templateUrl: 'app/views/budget.html',
		controller: 'budgetCtrl'
	});

	$stateProvider.state('login', {
		url: '^/ingreso',
		templateUrl: 'app/views/login.html',
		controller: 'loginCtrl',
		params: {
			errorcode: null
		}
	});
	$stateProvider.state('logout', {
		url: '^/saliendo',
		templateUrl: 'app/views/logout.html',
		controller: 'logoutCtrl',
		params: {
			errorcode: null
		}
	});

	$stateProvider.state('register', {
		url: '^/alta',
		templateUrl: 'app/views/register.html',
		controller: 'registerCtrl'
	});

	$stateProvider.state('error', {
		url: '^/error',
		templateUrl: 'app/views/error.html',
		controller: 'errorCtrl'
	});

});