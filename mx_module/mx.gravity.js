"use strict";


// dom and element modules are for the "wall"
// effect and for the enviroment interations.
mx.include.module.dependency.dom;
mx.include.module.dependency.element;
mx.include.module.dependency.events;
mx.include.module.dependency.player;

// mx's gravitiy engine
mx.gravity = (function () {
	var main = { wall: [] };

	var truthy = ["true"];
	var falsy = ["false"];
	var mx_obj_node_holder = "holder";

	var attrs = main.attrs = {
		solid: "mx_solid_object"
	}

	// checks if an element should be treated
	// as a solid substance.
	// a "solid" state determines if two objects
	// can collide into each other.
	var is_solid = main.is_solid = function (elem) {
		var pass = false;

		if (m(elem).is_node)
			pass = x(truthy).in_array(elem.getAttribute(attrs.solid));
		else if (mx_obj_node_holder in elem)
			pass = x(truthy).in_array(elem[ mx_obj_node_holder ].getAttribute(attrs.solid));
		else
			pass = attrs.solid in elem && elem[ attrs.solid ];

		return pass;
	};

	// defines a node element as a solid
	// object which other solid objects
	// cannot pass through.
	var as_solid = main.as_solid = function (elem) {
		if (m(elem).is_node)
			elem.setAttribute(attrs.solid, true);
		else
			elem[ attrs.solid ] = true;

		if (mx_obj_node_holder in elem)
			as_solid(elem[ mx_obj_node_holder ]);

		return main.is_solid(elem);
	};


	// enviroment walls
	var build_wall = main.build_wall = function () {
		var top_wall = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === 0 && 
					this.offset[0] !== 0 && 
					this.offset[0] !== mx.dom.enviroment_dimensions.columns;
		}, mx.dom.enviroment_dimensions.columns - 1, true);

		var bottom_wall = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === mx.dom.enviroment_dimensions.rows && 
					this.offset[0] !== 0 && 
					this.offset[0] !== mx.dom.enviroment_dimensions.columns;
		}, mx.dom.enviroment_dimensions.columns - 1, true);

		var right_wall = mx.storage.select.element(["node"], function () {
			return	this.offset[0] === 0 && 
					this.offset[1] !== 0 && 
					this.offset[1] !== mx.dom.enviroment_dimensions.rows;
		}, mx.dom.enviroment_dimensions.rows - 1, true);

		var left_wall = mx.storage.select.element(["node"], function () {
			return	this.offset[0] === mx.dom.enviroment_dimensions.columns && 
					this.offset[1] !== 0 && 
					this.offset[1] !== mx.dom.enviroment_dimensions.rows;
		}, mx.dom.enviroment_dimensions.rows - 1, true);

		var top_right_corner = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === 0 &&
					this.offset[0] === mx.dom.enviroment_dimensions.columns;
		}, 1, true);

		var top_left_corner = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === 0 &&
					this.offset[0] === 0;
		}, 1, true);

		var bottom_right_corner = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === mx.dom.enviroment_dimensions.rows &&
					this.offset[0] === mx.dom.enviroment_dimensions.columns;
		}, 1, true);

		var bottom_left_corner = mx.storage.select.element(["node"], function () {
			return	this.offset[1] === mx.dom.enviroment_dimensions.rows &&
					this.offset[0] === 0;
		}, 1, true);

		// all elements that will make up the wall should be stored
		// in the same location since they should all behave more
		// or less the same
		var wall_nodes = []
			.concat(top_wall)
			.concat(bottom_wall)
			.concat(right_wall)
			.concat(left_wall)
			.concat(top_right_corner)
			.concat(top_left_corner)
			.concat(bottom_right_corner)
			.concat(bottom_left_corner);

		mx.queue.global(function () {
			x(wall_nodes).css({
				backgroundColor: mx.element.color_map.salmon
			}).each(function () {
				as_solid(this);
			});
		});

		main.wall = wall_nodes;
	};


	return main;
})();
