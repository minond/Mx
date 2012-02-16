"use strict";


// TODO: this whole concept just needs to be re/done/factored.
Mx.bind = (function () {
	var main = function (type, node, action) { $(node)[ type ](action); };

	// this is bad, i know, but for debugging we'll declare a
	// variable in the conditional so that map is made available
	// straight from Mx.bind.map
	if (Mx.debug.DEBUG_MODE)
		var map = main.map = {};
	else
		var map = {};

	var register = main.register = function (event_id, type, node, action) {
		if (event_id in map)
			// this is a registered event, but check if it needs to be overwritten
			if (map[ event_id ][ 0 ] === type && map[ event_id ][ 1 ] === node)
				return false;

		map[ event_id ] = [ type, node ];
		main(type, node, action);

		Mx.debug.logf("attached event. id: {%0}, type: {%1}", event_id, type);
		Mx.debug.log(node);
	};

	var trigger = main.trigger = function (event_id) {
		$(map[ event_id ][ 1 ])[ map[ event_id ][ 0 ] ]();
	};


	return main;
})();
