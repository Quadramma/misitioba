var app = angular.module("qjarvisConfig", []);
app.config(['$httpProvider', '$sceDelegateProvider',
	function($httpProvider, $sceDelegateProvider) {
		$httpProvider.defaults.useXDomain = true;
		$sceDelegateProvider.resourceUrlWhitelist(['self', /^https?:\/\/(cdn\.)?quadramma.com/]);
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);

app.run(['$rootScope',
	function($rootScope) {
		//console.log($rootScope);

		$rootScope.APP = 'misitioba';
		$rootScope.APPSESSION = $rootScope.APP + "_session";
		$rootScope.config = {
			cache_expiration_minutes: 5,
			apiUrl: 'http://localhost/code/gapi'
		};

		$rootScope.appget = function(str) {
			return store.get($rootScope[str]) || null;
		}
		$rootScope.appset = function(str, obj) {
			return store.set($rootScope[str], obj);
		}
		$rootScope.getSession = function() {
			//Prioridad: angular, store.
			return $rootScope.session || $rootScope.appget('APPSESSION') || {};
		}

		//Store session and angular session should be in sync.
		$rootScope.session = $rootScope.getSession() || {};
		$rootScope.appset($rootScope.APPSESSION, $rootScope.session);
		//$http.defaults.headers.common['auth-token'] = $rootScope.session || "";
		//

		$rootScope.APIERROR = {
			API_TOKEN_EXPIRED: 3,
			INVALID_TOKEN: 4,
			INVALID_CREDENTIALS: 5,
			ROUTE_NOT_FOUND: 6,
			UNKNOWN_EXCEPTION: 7
		};


	}
]);