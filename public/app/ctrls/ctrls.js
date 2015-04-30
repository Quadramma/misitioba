var app = angular.module('ctrls', [

	'home.ctrl',

	'services.ctrl',

	'contact.ctrl',

	'budget.ctrl', 'login.ctrl', 'popup.ctrl','register.ctrl','error.ctrl'

])

.controller("genericCtrl", function(

	$scope, $state, $rootScope, $api, $location

	, focus, select, $timeout) {
	console.info("genericCtrl");
});