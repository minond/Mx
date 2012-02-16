"use strict";


Mx.comp = null;

Mx.component = (function () {
	var main = {};
	var custom_components = Mx.comp = {};

	var reg = main.register = function (cframework) {
		custom_components[ cframework.name ] = cframework;
		Mx.debug.logf("loaded and registered {%0} component", cframework.name);
	};

	return main;
})();
