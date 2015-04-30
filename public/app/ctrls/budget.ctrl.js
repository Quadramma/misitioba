var app = angular.module('budget.ctrl', [])
	.controller("budgetCtrl", function(

		$scope, $state, $rootScope, $api, $location, $user

		, focus, select, $timeout, $session
	) {
		console.info("budgetCtrl");

		$user.exist('admin', null, function() {
			$user.save('admin', '1234');
		});

		//$user.clean();
		//$session.login('pepe', '123');

		$session().isavaliable(function() {
			//Formulario
		}, function() {
			//Redirect login
			$timeout(function() {
				$state.go('register', {});
			});
		});

	});