"use strict";


mx.include.module.dependency.events;
mx.include.module.dependency.helpers;

(function () {
	var main = { name: "pl_placement" };

	var units = 'px';
	var start = { y: 55, x: 140 };
	var offset = { x: 42, y: 12 };
	var padding = 40;

	var destination = function (x, y) {
		return {
			x: start.x + (offset.x * x + (padding * y)),
			y: start.y + (offset.y * y),
			_x_: x,
			_y_: y
		};
	}

	main.place = function (node, _x_, _y_) {
		var dest = destination(_x_, _y_);

		dest.id = node.id;
		mx.out.movement(dest);

		x(node, true).css({
			'left': dest.x + units,
			'top': dest.y + units
		});
	};

	main.move = function (node, _x_, _y_) {
		var dest = destination(_x_, _y_);

		dest.id = node.id;
		mx.out.movement(dest);

		$(node, true).animate({
			'left': dest.x + units,
			'top': dest.y + units
		}, "fast");
	};

	mx.out.register("movement", "<div><span>movement: </span><span class='move'>[{%_x_}:{%x}, {%_y_}:{%y}] {%id}</span></div>");

	mx.components.register(main);
})();
