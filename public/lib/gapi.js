var serv = angular.module("gapi", ['ngResource']);
serv.factory("$api", ["$resource", '$rootScope', '$state', '$timeout',
	function($resource, $rootScope, $state, $timeout) {



		function getTimestampDuration(m1, m2) {
			var ms = Math.abs(m2 - m1);
			days = Math.floor(ms / (24 * 60 * 60 * 1000));
			daysms = ms % (24 * 60 * 60 * 1000);
			hours = Math.floor((daysms) / (60 * 60 * 1000));
			hoursms = ms % (60 * 60 * 1000);
			minutes = Math.floor((hoursms) / (60 * 1000));
			minutesms = ms % (60 * 1000);
			sec = Math.floor((minutesms) / (1000));
			//return {d: days,h: hours,m: minutes,s: sec};
			return hours + 'hs ' + minutes + 'min ' + sec + 'sec';
		}
		var $QJTime = {
			getTimestampDuration: getTimestampDuration
		};


		var rta = new(function() {

			//api in root
			if (_.isUndefined($rootScope.api)) {
				var _apiInfo = {
					status: 'Waiting',
					calls: [],
					calls_working: 0,
					calls_finished: 0,
					list: function() {
						for (var x in this.calls) {
							console.info('[' + x + ']' + this.calls[x].info.action + ' -> req[' + JSON.stringify(this.calls[x].req) + '] res[' + JSON.stringify(this.calls[x].res) + ']');
						}
					},
					callsInProgress: function() {
						var asd = (_.filter(_apiInfo.calls, function(call) {
							return call.ended = true;
						})).length();

						return 0;
					},
					start: function(info, postData) {
						postData = postData || {};
						var call = {
							info: info,
							req: postData,
							ended: false,
							startTime: (new Date()).getTime(),
							endTime: null,
							duration: null
						};
						_apiInfo.calls_working += 1;
						_apiInfo.status = 'Working';
						_apiInfo.calls.push(call);
						return { //represents the call
							end: function(res) {
								res = res || {};
								call.res = res;
								call.ended = true;
								call.endTime = (new Date()).getTime();
								call.duration = (call.startTime - call.endTime) / 100; //dur in secs.
								_apiInfo.calls_working -= 1;
								_apiInfo.calls_finished += 1;
								if (_apiInfo.calls_working == 0) {
									_apiInfo.status = 'Waiting';
								}
							}
						};
					},
					buildCacheItemId: function(ctrlName, params, postData) {
						var concat = ctrlName;
						for (var x in params) {
							var param = params[x];
							concat += param;
						}
						for (var x in postData) {
							var data = postData[x];
							concat += data;
						}
						return concat;
					},
					newCacheItemFunct: function(cacheItem) {
						cacheItem.setRes = function(res) {
							var self = this;
							$session.httpcache[self.index].res = res;
						};
						cacheItem.hasRes = function() {
							return this.res != null;
						};
						return cacheItem;
					},
					newCacheItem: function(params) {
						var rta = {
							id: params.id,
							index: params.index,
							params: {},
							postData: {},
							res: null,
							expiration: (new Date()).getTime(),
							expirein: $QJTime.getTimestampDuration(
								$rootScope.config.cache_expiration_minutes / 1000
							)
						};
						rta = this.newCacheItemFunct(rta);
						return rta;
					},
					getCache: function(ctrlName, params, postData) {
						var self = this;
						var id = this.buildCacheItemId(ctrlName, params, postData);
						//
						params.cacheable = params.cacheable || false;
						if (!params.cacheable) {
							return {
								hasRes: function() {
									return false;
								},
								setRes: function() {}
							}
						}

						//console.log('id[' + id + ']:' + JSON.stringify(postData));

						if (!$rootScope.session.httpcache) $rootScope.session.httpcache = [];
						//tryget
						var rtacache = null;
						for (var x in $rootScope.session.httpcache) {
							var item = $rootScope.session.httpcache[x];
							//	console.log('item.id[' + item.id + ']==id[' + id + ']');
							if (item.id == id) {
								rtacache = item;

								var diff =
									(rtacache.expiration + ((parseInt($rootScope.config.cache_expiration_minutes) * 60) * 1000)) -
									(new Date()).getTime();
								if (diff < 0) {
									rtacache = null;
									$rootScope.session.httpcache.splice(x, 1);
								} else {

									rtacache.expirein =
										$QJTime.getTimestampDuration(diff);
								}
								break;
							}
						}
						if (_.isUndefined(rtacache) || _.isNull(rtacache)) {
							var newItem = self.newCacheItem({
								id: id,
								index: $rootScope.session.httpcache.length
							});
							$rootScope.session.httpcache.push({
								id: newItem.id,
								index: newItem.index,
								params: newItem.params,
								postData: newItem.postData,
								res: newItem.res,
								expiration: newItem.expiration,
								expiration_seconds: newItem.expiration_seconds
							});
							return newItem;
						} else {
							rtacache = self.newCacheItemFunct(rtacache);
							return rtacache;
						}
					}
				};

				/*
				var call = _apiInfo.start({
					description: 'Test task for api'
				});
				call.end();
				*/

				//$rootScope.config.apiUrl = $rootScope.config.apiUrl || 'http://localhost/code/gapi';

				$rootScope.api = _apiInfo;

				gapi = $rootScope.api;
				gapi.get = function(n) {
					return $rootScope[n];
				}
			}



			function goto(s, p) {
				$timeout(function() {
					$state.go(s, p);
				});
			}
			var errorHandler = {
				handle: function(errorcode) {
					if (isNaN(errorcode)) return false;
					switch (parseInt(errorcode)) {
						case $rootScope.APIERROR.API_TOKEN_EXPIRED:
							$rootScope.session.expired = true;
							goto('login', {
								errorcode: $rootScope.APIERROR.API_TOKEN_EXPIRED
							});
							return true;
							break;
						case $rootScope.APIERROR.INVALID_TOKEN:
							$rootScope.session.expired = true;
							goto('login', {
								errorcode: $rootScope.APIERROR.INVALID_TOKEN
							});
							return true;
							break;
					}
					return false;
				}
			}

			//--CLASS DEF
			var self = this;

			//PRIVATEE
			function hasReportedErrors(res, ignoreBadRequest) {
				if (res && _.isUndefined(res.ok)) {
					console.warn('API_INVALID_RESPONSE');
					return true;
				}
				if (res && !_.isUndefined(res.ok) && res.ok == false && !ignoreBadRequest) {
					if (res && !_.isUndefined(res.errorcode)) {
						var str = "Unknown errorcode number.";
						for (var x in $rootScope.APIERROR) {
							if (parseInt($rootScope.APIERROR[x]) == parseInt(res.errorcode)) {
								str = x;
							}
						}
						console.warn('api warning -> handling errorcode ' + res.errorcode + ' [' + str + ']');

						var handlerSuccess = errorHandler.handle(res.errorcode);
						if (handlerSuccess) {
							return false; //Caso: se delego al errorHandler.
						}
						return true;
					} else {
						console.warn('API_RESPONSE_HAS_ERRORS_WITHOUT_ERRORCODE');
						return true;
					}
				}
				return false;
			}

			function getController(controllerName, ignoreBadRequest) {
				ignoreBadRequest = ignoreBadRequest || false;
				//				console.log("apiService -> getController[" + controllerName + "] -> ignoreBadRequest -> " + ignoreBadRequest);
				var $res = $resource($rootScope.config.apiUrl + '/:controller/:action/:id', {}, {
					query: {
						method: "GET",
						isArray: true
					},
					get: {
						method: "GET",
						isArray: false,
						params: {
							controller: controllerName
						}
					},
					request: {
						method: 'POST',
						isArray: false,
						params: {
							controller: controllerName
						}
					},
					save: {
						method: 'POST',
						isArray: false
					},
					update: {
						method: 'POST',
						isArray: false
					},
					delete: {
						method: "DELETE",
						isArray: false
					}
				});


				function gotoErrorState() {
					$timeout(function() {
						$state.go('error', {});
					});
				}


				var controller = {};
				controller.hasReportedErrors = hasReportedErrors;
				controller.post = function(params, postData, success, failure) {

					var cache = $rootScope.api.getCache(controllerName, params, postData);
					if (cache.hasRes()) {
						if (!hasReportedErrors(cstartache.res, ignoreBadRequest)) {
							success(cache.res);
						}
						return;
					}

					var call = $rootScope.api.start(params, postData);

					if (params && typeof params.cacheable != 'undefined') {
						delete(params.cacheable);
					}



					$res.request(params, postData, function(res) {
						call.end(res);
						if (!hasReportedErrors(res, ignoreBadRequest)) {
							success(res);
							cache.setRes(res);
						} else {
							gotoErrorState();
						}
					}, function(res) {
						call.end(res);
						failure && failure(res);
						gotoErrorState();
					});

				}

				controller.get = function(params, success) {

					var cache = $rootScope.api.getCache(controllerName, params, {});
					if (cache.hasRes()) {
						if (!hasReportedErrors(cache.res, ignoreBadRequest)) {
							success(cache.res);
						}
						return;
					}


					var call = $rootScope.api.start(params);

					if (params && typeof params.cacheable != 'undefined') {
						delete(params.cacheable);
					}

					$res.get(params, function(res) {
						call.end(res);
						if (!hasReportedErrors(res, ignoreBadRequest)) {
							success(res);
							cache.setRes(res);
						} else {
							gotoErrorState();
						}
					}, function(res) {
						call.end(res);
						if (res && !_.isUndefined(res.status) && res.status == 500) {
							console.warn('API_INTERNAL_SERVER_ERROR_500');
						} else {
							console.warn('API_INTERNAL_SERVER_ERROR');
						}
						gotoErrorState();
					});
				};



				return controller;
			}

			//PUBLIC --------------------------------------
			self.getController = function(controllerName, ignoreBadRequest) {
				return getController(controllerName, ignoreBadRequest);
			};
			self.getLoginController = function(controllerName) {
				console.info("login controller return");
				return getController(controllerName, true);
			};
			self.isOK = function(success, failure) {
				//Check api status
				var Test = self.getController("test");
				Test.get({
					action: "status"
				}, function(res) {
					if (res && !_.isUndefined(res.ok) && res.ok == true) {
						success();
					} else {
						failure();
					}
				})
			};
			return self;
			//--CLASS DEF
		})();
		return rta; //factory return
	}
]);