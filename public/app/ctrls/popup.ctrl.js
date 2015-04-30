var app = angular.module('popup.ctrl', [])
	.controller("popupCtrl", function(

		$scope, $state, $rootScope, $api, $location

		, focus, select, $timeout, $popup) {
		console.info("popupCtrl");


		$scope.attr = {
			show: false
		};

		$rootScope.$on('popup.show', function() {
			$scope.attr.show = true;
		});
		$rootScope.$on('popup.hide', function() {
			$scope.attr.show = false;
		});

	})

app.factory('$popup', function($rootScope, $api, $http, $timeout) {
	var self = {
		show: function(str) {
			$timeout(function() {
				zest('#popup')[0].innerHTML = str;
				$rootScope.$emit('popup.show');
				$timeout(self.hide, 2000);
			});
		},
		hide: function() {
			$rootScope.$emit('popup.hide');
		}
	}
	return self;
});