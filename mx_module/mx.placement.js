"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.player;
mx.include.module.dependency.element;
mx.include.module.dependency.storage;
mx.include.module.dependency.helpers;

mx.placement = (function () {
	var main = {};
	var sample_node, node_dimensions;

	main.initialize = manage.limit(function () {
		// calculate the dimensions of the 
		// enviroment elements
		sample_node = mx.storage.select.element(["node"], function () {
			return this.type === mx.element.type.ENV;
		}, true, true)[0];

		node_dimensions = {
			width: x(mx.element.gcs(sample_node, "width")).px2num(),
			height: x(mx.element.gcs(sample_node, "height")).px2num()
		};
	}, 1);

	// calculates the size of a given element so that
	// possible placement can be allowed or rejected.
	var get_size = main.get_size = function (elem) {
		var node = mx.element.get_node(elem), dimensions = {};

		if (elem instanceof mx.element.player) {
			dimensions.width = elem.raw_width;
			dimensions.height = elem.raw_height;
			dimensions.player = true;
		}
		else {
			dimensions.width = x(mx.element.gcs(node, "width")).px2num();
			dimensions.height = x(mx.element.gcs(node, "height")).px2num();
			dimensions.player = false;
		}

		return dimensions;
	};

	// find surrounding nodes using an element's dimensions

	return main;
})();
