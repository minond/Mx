"use strict";


mx.url = (function () {
	var main = {}, parts, part;
	var query = window.location.search.split("?")[1];

	if (query) {
		parts = query.split("&");

		for (var i = 0, m = parts.length; i < m; i++) {
			part = parts[i].split("=");

			if (part.length === 1)
				part = parts[i].split(":");

			if (part.length === 2)
				main[ part[0] ] = part[1];
		}
	}


	return main;
})();
