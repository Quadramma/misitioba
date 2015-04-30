var serv = angular.module("qjarvisLang", []);
serv.factory("$Lang", ["$resource", '$rootScope',
	function($resource, $rootScope) {
		arr = {};
		return {
			get: function(id, language) {
				if (typeof arr[language] == 'undefined') {
					console.warn('lang not defined language ' + language);
					return;
				};
				if (typeof arr[language][id] == 'undefined') {
					console.warn('lang id not defined language ' + language + ' id ' + id);
					return;
				};
				return arr[language][id];
			},
			set: function(id, language, val) {
				if (typeof arr[language] == 'undefined') {
					arr[language] = {};
				};
				arr[language][id] = val;
			}
		};
	}
]);