"use strict";


mx.include.module.dependency.dom;
mx.include.module.dependency.element;
mx.include.module.dependency.events;

// mx's gravitiy engine
mx.gravity = (function () {
	var main = {};

	var attrs = main.attrs = {
		solid: "mx_solid_object"
	}

	// checks if an element should be treated
	// as a solid substance.
	var is_solid = main.is_solid = function (node) {
		return attr in node && node[ attr ];
	};

	// defines a node element as a solid
	// object which other solid objects
	// cannot pass through.
	var as_solid = main.as_solid = function (node) {
		node.setAttribute(attr, true);
		node[ attr ] = true;
		return main.is(node);
	};


	return main;
})();
