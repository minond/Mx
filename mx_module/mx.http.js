"use strict";


mx.include.module.dependency.debug;

mx.http = (function () {
	var main = {};

	var genxhr = (function () {
		return function () {
			return new XMLHttpRequest();
		};
	})();

	// makes a synchronous http request to a given
	// url and returns the response text.
	main.syncget = function (fileurl) {
		var xhr = genxhr();
		xhr.open("GET", fileurl, false);
		xhr.send(null);
		
		return xhr.responseText;
	};

	return main;
})();
