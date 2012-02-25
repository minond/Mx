"use strict";


// components manager. currently used only 
// to register new components into the 
// mx.component element
// @see mx.component
mx.components = (function () {
	var main = {};

	// this is the main object holding all components
	var components = mx.component = {};

	// a component object is passed in the register
	// function which storage the new component into the
	// component object. every component should have
	// a name and init property and method. 
	// this method could be used in the future to monipulate
	// the new componenet or normalize it.
	main.register = function (component) {
		components[ component.name ] = component;
		mx.message("registered component: {%0}", component.name);
	};

	return main;
})();
