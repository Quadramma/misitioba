var app = angular.module("user.serv", []);
app.factory('$user', function($rootScope, $api, $http) {
	var self = {
		exist: function(name, fnTrue, fnFalse) {
			this.db = this.db || $api.getController('user');
			this.db.post({
				action: 'exist'
			}, {
				name: name
			}, function(res) {
				res && res.rta && res.rta == true && fnTrue && fnTrue();
				res && typeof res.rta != 'undefined' && res.rta == false && fnFalse && fnFalse();
			});
		},
		save: function(name, pass) {
			this.db = this.db || $api.getController('user');
			this.db.post({
				action: 'save'
			}, {
				name: name,
				pass: pass
			}, function(res) {

			});
		},
		clean: function() {
			this.db = this.db || $api.getController('user');
			this.db.get({
				action: 'clean'
			}, function(res) {

			});
		}
	}
	return self;
});