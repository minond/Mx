"use strict";


mx.include.module.dependency.http;

mx.file = (function () {
	var main = {};

	// makes a synchronous request to a file and 
	// returns it's contents
	main.read = function (fname) {
		return mx.http.syncget(fname);
	};

	return main;
})();
