var app = angular.module('register.ctrl', [])
	.controller("registerCtrl", function(

		$scope, $state, $rootScope, $api, $location

		, focus, select, $timeout, $user, $popup) {
		console.info("registerCtrl");

		$scope.data = {
			name: '',
			pass: ''
		};

		$scope.keypress = function(e) {
			e = e || window.event;
			if (e.which === 13) {
				$scope.register();
			}
		}

		$scope.validarCampos=function() {
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

		$scope.register = function() {
			//val
			if(!$scope.validarCampos())return;

			$user.exist('admin', function() {
				$popup.show('El nombre ' + $scope.data.name + ' ya esta en uso.');
			}, function() {
				$user.save($scope.data.name, $scope.data.pass);
			});


		}


	});