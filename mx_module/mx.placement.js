"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.player;
mx.include.module.dependency.element;

mx.placement = (function () {
	var main = {};
	var node_warning = "Missing node element, creating new block.";

	var get_node = function (elem) {
		var node;

		if (is_node(elem))
			node = elem;
		else if (mx.element.player.holder in elem)
			node = elem[ mx.element.player.holder ];
		else {
			mx.debug.warn(node_warning);
			mx.debug.back_trace();
			node = mx.element.block();
		}

		return node;
	};

	var get_size = function (elem) {
		var node = get_node(elem);
		var width = x(mx.element.gcs(node, "width")).px2num();
		var height = x(mx.element.gcs(node, "height")).px2num();
	};

	return main;
})();
