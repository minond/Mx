"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.character;
mx.include.module.dependency.element;
mx.include.module.dependency.storage;
mx.include.module.dependency.helpers;

mx.placement = (function () {
	var main = {};
	var sample_node, node_dimensions = main.node_dimensions = {};

	var directions = ["up", "down", "left", "right"];
	var direction = main.direction = manage.enum.apply(manage, directions);

	var settings = main.settings = {
		animate: false
	};

	main.initialize = function (custom_settings) {
		mx.settings.merge(settings, mx.settings.placement);
		mx.out.initialized("placement");
		main.survey();

		if (settings.animate)
			mx.include.dependency("jquery");
	};

	main.survey = function () {
		// calculate the dimensions of the 
		// enviroment elements
		if (!sample_node)
		sample_node = mx.storage.select.element(["node"], function () {
			return this.type === mx.element.type.ENV;
		}, 1, true)[0];

		node_dimensions.width = x(mx.element.gcs(sample_node, "width")).px2num();
		node_dimensions.height = x(mx.element.gcs(sample_node, "height")).px2num();
	};

	// puts an element in an enviroment node
	var put = function (elem, offset) {
		var node = mx.element.get_node(elem);
		var top, left;

		main.survey();

		top = x(node_dimensions.height * offset[1] + offset[1] + mx.dom.defaults.vp_offset.top).num2px();
		left = x(node_dimensions.width * offset[0] + offset[0] + mx.dom.defaults.vp_offset.left).num2px();

		if (settings.animate) {
			$(node).animate({ top: top, left: left }, 150);
		}
		else {
			x(node).css({ top: top, left: left });
		}

		if (m(elem).is_character) {
			elem.offset = offset;
		}
	};

	// place an element in the viewport
	var place = main.place = function (elem, proposed_holder_info, cache_dir, no_recalc) {
		mx.queue.global(function () {
			var elem_info = get_size(elem);
			var end_x, end_y, end_holder;
			var table = "element";

			if (elem.view_range_bit) {
				table = elem.holder.id;
			}

			if (!proposed_holder_info) {
				proposed_holder_info = mx.storage.select.timed(["node", "offset"], table, function () {
					return this.type === mx.element.type.ENV && !this.node.mx_gravity; 
				}, 1)[0];
			}

			if (elem_info.character && proposed_holder_info.node) {
				// using the character's dimensions, it is placed in the viewport
				// wherever there is enough enviroment nodes to hold it.
				end_x = elem_info.width + proposed_holder_info.offset[0];
				end_y = elem_info.height + proposed_holder_info.offset[1];

				// zero index
				--end_x;
				--end_y;

				end_holder = mx.storage.select.timed(["node"], table, function () {
					return x(this.offset).eq([end_x, end_y]);
				}, 1)[0];

				// a holder was found
				if (end_holder && end_holder.node) {
					elem._holder = end_holder.node;
					put(elem, [proposed_holder_info.offset[0], proposed_holder_info.offset[1]]);
				}
				else if (m(elem).is_character && cache_dir) {
					elem.movement[ cache_dir ] = false;
					mx.movement.recalculate_character_viewport(elem);

					if (!no_recalc)
						place(elem, proposed_holder_info, cache_dir, true);
				}

				if (m(elem).is_character) {
					elem.movement.ready = true;
				}
			}
		});
	};

	// calculates the size of a given element so that
	// possible placement can be allowed or rejected.
	var get_size = function (elem) {
		var node = mx.element.get_node(elem), dimensions = {};

		if (elem instanceof mx.element.character) {
			dimensions.width = elem.raw_width;
			dimensions.height = elem.raw_height;
			dimensions.character = true;
		}
		else {
			dimensions.width = x(mx.element.gcs(node, "width")).px2num();
			dimensions.height = x(mx.element.gcs(node, "height")).px2num();
			dimensions.character = false;
		}

		return dimensions;
	};

	return main;
})();
