"use strict";


Mx.debug = (function () {
	var main = {};
	var debug = main.DEBUG_MODE = main.DEBUG = main.debug = !!window.location.href.match("debug");

	main.log = function () {
		if (debug) {
			console.log.apply(console, arguments);
		}
	};

	main.logf = function () {
		if (debug) {
			console.log( stringf.apply(stringf, arguments) );
		}
	};

	main.errorf = function () {
		main.log( new Error( stringf.apply(stringf, arguments) ) );
	};


	return main;
})();
