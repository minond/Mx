"use strict";


mx.include.module.dependency.debug;

mx.http = (function () {
	var main = {};


	// makes a synchronous http request to a given
	// url and returns the response text.
	main.file_get_contents = function (fileurl) {
		var xhr = new XMLHttpRequest;
		xhr.open("GET", fileurl, false);
		xhr.send(null);
		
		return xhr.responseText;
	};

	return main;
})();
