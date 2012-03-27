"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.player;
mx.include.module.dependency.element;
mx.include.module.dependency.storage;
mx.include.module.dependency.helpers;

mx.placement = (function () {
	var main = {};
	var sample_node, node_dimensions;

	var directions = ["up", "down", "left", "right"];
	var direction = main.direction = manage.enum.apply(manage, directions);

	var settings = main.settings = {
		animate: false
	};

	main.initialize = function (custom_settings) {
		if (settings)
			for (var setting in custom_settings)
				settings[ setting ] = custom_settings[ setting ];

		main.survey();

		if (settings.animate)
			mx.include.dependency("jquery");
	};

	main.survey = function () {
		// calculate the dimensions of the 
		// enviroment elements
		sample_node = mx.storage.select.element(["node"], function () {
			return this.type === mx.element.type.ENV;
		}, true, true)[0];

		node_dimensions = {
			width: x(mx.element.gcs(sample_node, "width")).px2num(),
			height: x(mx.element.gcs(sample_node, "height")).px2num()
		};
	};

	// puts an element in an enviroment node
	var put = function (elem, offset) {
		var node = mx.element.get_node(elem);
		main.survey();

		if (settings.animate)
			$(node).animate({
				top: x(node_dimensions.height * offset[1] + offset[1]).num2px(),
				left: x(node_dimensions.width * offset[0] + offset[0]).num2px()
			}, 150);
		else
			x(node).css({
				top: x(node_dimensions.height * offset[1] + offset[1]).num2px(),
				left: x(node_dimensions.width * offset[0] + offset[0]).num2px()
			});


		if (m(elem).is_player) {
			elem.offset = offset;
		}
	};

	// place an element in the viewport
	var place = main.place = function (elem, proposed_holder_info, cache_dir) {
		mx.queue.global(function () {
			var elem_info = get_size(elem);
			var end_x, end_y, end_holder;

			if (!proposed_holder_info) {
				proposed_holder_info = mx.storage.select.element(["node", "offset"], function () {
					return this.type === mx.element.type.ENV && !this.node.mx_gravity; 
				}, 1)[0];
			}

			if (elem_info.player && proposed_holder_info.node) {
				// using the player's dimensions, it is placed in the viewport
				// wherever there is enough enviroment nodes to hold it.
				end_x = elem_info.width + proposed_holder_info.offset[0];
				end_y = elem_info.height + proposed_holder_info.offset[1];

				// zero index
				--end_x;
				--end_y;

				end_holder = mx.storage.select.element(["node"], function () {
					return x(this.offset).eq([end_x, end_y]);
				}, 1)[0];

				// a holder was found
				if (end_holder && end_holder.node) {
					elem._holder = end_holder.node;
					put(elem, [proposed_holder_info.offset[0], proposed_holder_info.offset[1]]);
				}
				else if (m(elem).is_player && cache_dir) {
					elem.movement[ cache_dir ] = false;
					mx.sound.play.crash;
				}

				if (m(elem).is_player) {
					elem.movement.ready = true;
				}
			}
		});
	};

	// calculates the size of a given element so that
	// possible placement can be allowed or rejected.
	var get_size = function (elem) {
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

	return main;
})();
