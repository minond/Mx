"use strict";


mx.include.module.dependency.url;

// global debugging flag.
mx.debugging;

// wrapper for console.log
// methods do check if debugging is enabled/flagged
// in the enviroment before any output happens.
mx.debug = (function () {
	var main = {};
	var debug;

	// 'debug' in the url in the main debug flag
	// mx.queue.action = function () {
		debug = mx.debugging = !!mx.url.debug;
	// }

	// timer storage
	var timing = {};

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

	// helper function for time and timeEnd
	main.time = function (what) {
		if (debug) {
			if (what in timing) {
				console.timeEnd(what);
				delete timing[ what ];
			}
			else {
				timing[ what ] = 1;
				console.time(what);
			}
		}
	};


	return main;
})();
