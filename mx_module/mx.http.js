"use strict";

(function (self) {
	var main = self.module.register("http");

	// the idea behind this method is that it could check
	// for which http object to create (for IE) making
	// mx a little more cross browser compatible
	var genxhr = (function () {
		return function () {
			return new XMLHttpRequest;
		};
	})();
	
	// makes an http request
	main.request = function (url, method, async, data) {
		var xhr = genxhr();
		var ret;

		xhr.open(method, url, async);
		xhr.send(null);

		ret = xhr.responseText;
		return ret;
	};

	// makes a synchronous http request
	main.async_get = function (url) {
		return main.request(url, "GET", false, null);
	};
})(mx);
