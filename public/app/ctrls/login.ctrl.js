var app = angular.module('login.ctrl', [])
	.controller("logoutCtrl", function($scope,$timeout,$state) {
		console.info("logoutCtrl");
		$timeout(function() {
			$state.go('home', null);
		}, 1000);

	})
	.controller("loginCtrl", function(

		$scope, $state, $rootScope, $api, $location

		, focus, select, $timeout, $user, $popup, $session) {
		console.info("loginCtrl");


		var errorcode = $state.params.errorcode || 0;
		if (errorcode == $rootScope.APIERROR.API_TOKEN_EXPIRED) {
			$popup.show('Se perdio la session. Ingrese nuevamente');
		}
		if (errorcode == $rootScope.APIERROR.INVALID_TOKEN) {
			$popup.show('Necesita autentificarse');
		}



		$scope.data = {
			name: 'admin',
			pass: '1234'
		};

		$scope.keypress = function(e) {
			e = e || window.event;
			if (e.which === 13) {
				$scope.login();
			}
		}

		$scope.validarCampos = function() {
			if ($scope.data.name === '') {
				$popup.show('Ingrese un nombre de usuario.');
				return false;
			}
			if ($scope.data.pass === '') {
				$popup.show('Ingrese un password.');
				return false;
			}
			return true;
		}

		$scope.login = function() {
			//val
			if (!$scope.validarCampos()) return;


			$session().login($scope.data.name, $scope.data.pass, function(user, session) {
				//console.log(session);				
				$timeout(function() {
					$state.go('home', null);
				});
				$session().showTokenStatus();
			}, function() {
				//invalid credentials
				$popup.show('Credenciales invalidas');
			});

		}


	});