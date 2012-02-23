"use strict";


// wrapper for console.log
// methods do check if debugging is enabled/flagged
// in the enviroment before any output happens.
Mx.debug = (function () {
	var main = {};

	// 'debug' in the url in the main debug flag
	var debug = main.ON = !!window.location.href.match("debug");

	// wrapper for console.log
	main.log = function () {
		if (debug) {
			console.log.apply(console, arguments);
		}
	};

	// wrapper for console.log using stringf
	main.logf = function () {
		if (debug) {
			console.log( Template.stringf.apply(stringf, arguments) );
		}
	};

	// same as logf but storing everything in a 
	// new Error instance.
	main.errorf = function () {
		main.log( new Error( Template.stringf.apply(stringf, arguments) ) );
	};


	return main;
})();
