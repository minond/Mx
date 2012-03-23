"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.player;
mx.include.module.dependency.element;

mx.placement = (function () {
	var main = {};

	var dimensions = main.dimensions = {
		w: 32 / 3,
		h: 21 / 2
	};

	var get_size = main.get_size = function (elem) {
		var node = mx.element.get_node(elem);
		var width = x(mx.element.gcs(node, "width")).px2num();
		var height = x(mx.element.gcs(node, "height")).px2num();

		return [width, height];
	};

	return main;
})();
