"use strict";

Mx.components = (function () {
	var main = {};
	var components = mx.component = {};

	main.register = function (component) {
		components[ component.name ] = component;
		mx.message("registered component:", component.name);
	};

	return main;
})();
