"use strict";


Mx.debug = (function () {
	var main = {};
	var d = main.DEBUG_MODE = !!window.location.href.match("debug");

	var log = main.log = function () {
		if (d) {
			console.log.apply(console, arguments);
		}
	};

	var logf = main.logf = function () {
		if (d) {
			console.log( stringf.apply(stringf, arguments) );
		}
	};

	var errorf = main.errorf = function () {
		log( new Error( stringf.apply(stringf, arguments) ) );
	};


	return main;
})();
