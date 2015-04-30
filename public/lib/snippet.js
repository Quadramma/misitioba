function snippet_evt_off(e, evt, fn) {
	if (e.removeEventListener) {
		e.removeEventListener(evt, fn);
	} else if (e.detachEvent) {
		e.detachEvent('on' + evt, fn);
	}
}

function snippet_evt_on(elem, event, fn) {
	function listenHandler(e) {
		var ret = fn.apply(this, arguments);
		if (ret === false) {
			e.stopPropagation();
			e.preventDefault();
		}
		return (ret);
	}

	function attachHandler() {
		var ret = fn.call(elem, window.event);
		if (ret === false) {
			window.event.returnValue = false;
			window.event.cancelBubble = true;
		}
		return (ret);
	}
	if (elem.addEventListener) {
		elem.addEventListener(event, listenHandler, false);
		return listenHandler;
	} else {
		elem.attachEvent("on" + event, attachHandler);
		return attachHandler;
	}
}

function snippet_date_diference(d1, d2) {
	var m1 = d1.getTime();
	var m2 = d2.getTime();
	return snippet_date_milli_diference(m1, m2);
}

function snippet_date_milli_diference(m1, m2) {
	var ms = Math.abs(m2 - m1);
	days = Math.floor(ms / (24 * 60 * 60 * 1000));
	daysms = ms % (24 * 60 * 60 * 1000);
	hours = Math.floor((daysms) / (60 * 60 * 1000));
	hoursms = ms % (60 * 60 * 1000);
	minutes = Math.floor((hoursms) / (60 * 1000));
	minutesms = ms % (60 * 1000);
	sec = Math.floor((minutesms) / (1000));
	return {
		d: days,
		h: hours,
		m: minutes,
		s: sec
	};
}

function snippet_preloadImages(a, b) {
	var o = {};
	for (var x in a) {
		(function() {
			var i = new Image(),
				y = x;
			i.onload = function() {
				o[a[y]] = i;
			};
			i.src = a[x];
		})();
	}
	var v = setInterval(function() {
		var c = 0;
		for (x in o) {
			c++;
		}
		if (c == a.length) {
			b(o);
			clearInterval(v);
		}
	}, 500);
}

function snippet_preloadImages_description_url(a, b) {
	for (var xx in a) {
		(function() {
			var i = new Image(),
				y = xx;
			i.onload = function() {
				var o = {};
				o[y] = i;
				b(o);
			};
			//console.log('src -> '+a[y]);
			i.src = a[y];
		})();
	}
}

function snippet_scale_restrictW(w, h, r) {
	var rta = {
		w: w,
		h: h
	}
	if (w > r) {
		rta.w = r;
		rta.h = (rta.w * h) / w;
	}
	return rta;
}

function snippet_scale_restrictH(w, h, r) {
	var rta = {
		w: w,
		h: h
	};
	if (h > r) {
		rta.h = r;
		rta.w = (rta.h * w) / h;
	}
	return rta;
}

function snippet_scale_restrictAuto(w, h, rw, rh) {
	var r = null;
	if (w >= h) {
		if (w > rw) {
			r = snippet_scale_restrictW(w, h, rw);
			return snippet_scale_restrictH(r.w, r.h, rh);
		}
	} else {
		if (h > rh) {
			r = snippet_scale_restrictH(w, h, rh);
			return snippet_scale_restrictW(r.w, r.h, rw);
		}
	}
	return {
		w: w,
		h: h
	};
}

function snippet_url_exist(url, fn) {
	var reader = new XMLHttpRequest();
	var checkFor = url;
	reader.open('get', checkFor, true);
	reader.onreadystatechange = checkReadyState;

	function checkReadyState() {
		if (reader.readyState === 4) {
			if ((reader.status == 200) || (reader.status == 0)) {
				fn(true);
			} else {
				fn(false);
				return;
			}
		}
	}
	reader.send(null);
}


function snippet_waitForChecks(numberOfChecks, callback) {
	var checks = numberOfChecks
	var currCheck = 0;
	var o = {
		check: function() {
			currCheck++;
		}
	}
	var checkInterval = setInterval(function() {
		if (currCheck == checks) {
			clearInterval(checkInterval);
			callback();
		}
	}, 500);
	return o;
}