var app = angular.module("session.serv", []);
app.factory('$session', function($rootScope, $api, $http) {
	function get() {
		var self = $rootScope.getSession();
		$http.defaults.headers.common['auth-token'] = self.token || "";
		var f = {};
		f.isavaliable = function(fnTrue, fnFalse) {
			//Caso: no existe un token
			if(self && (!self.token||!self.tokenExp||!self.tokenReq)){
				fnFalse && fnFalse();
				return;
			}
			//Caso: token vencido
			var milliNow = new Date().getTime();
			var milliDiff = milliNow - parseInt(self.tokenExp);
			var milliPositivo = (milliDiff / 1000);
			if(milliPositivo>0){
				fnFalse && fnFalse();
				return;	
			}
			//Caso: token vencido en servidor
			this.db = this.db || $api.getController('session');
			this.db.get({
				action: 'isavaliable'
			}, function(res) {
				res && res.rta && res.rta == true && fnTrue && fnTrue();
				res && typeof res.rta != 'undefined' && res.rta == false && fnFalse && fnFalse();
			});
		};
		f.showTokenStatus = function() {
			if (!self.tokenExp) {
				return;
			}
			var milliNow = new Date().getTime();
			var milliDiff = milliNow - parseInt(self.tokenExp);
			var expirationSeconds = (Math.abs(milliDiff) / 1000);
			if (milliDiff > 0) {
				//Si es positivo significa que el tiempo actual es mayor al de exp, por lo que el token expiro.
				console.log('$session -> Token -> expired');
			} else {
				console.log('$session -> Token -> expires in ' + expirationSeconds + ' seconds');
			}
		};
		f.login = function(name, pass, fnSuccess, fnFail) {
			this.db = this.db || $api.getController('session');
			var reqData = {
				"name": name,
				"pass": pass,
				"tokenReq": new Date().getTime()
			};
			this.db.post({
				action: "login"
			}, reqData, function(res) {
				if (res.rta.session !== null) {
					res.rta.session.user = res.rta.user;
					f.set(res.rta.session);
					fnSuccess && fnSuccess(res.rta.user, res.rta.session);
				} else {
					fnFail && fnFail();
				}
			});
		};
		f.logout = function(){
			store.remove($rootScope.APPSESSION);
			$rootScope.session = {};
		};
		f.set = function(obj) {
			for (var x in obj) {
				self[x] = obj[x];
			}

			//Store session and angular session should be in sync.
			self.expired = false;
			$rootScope.session = self;
			$rootScope.appset('APPSESSION', self);
		}
		return f;
	}
	return get;
});