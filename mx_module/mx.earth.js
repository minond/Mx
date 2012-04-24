"use strict";


(function (self) {
	self.include.module.file;

	var main = self.module.constructor("Earth", self.enviroment);

	// default directory
	main.static.ini_directory = "mx_enviroments/{%0}.ini";
	main.static.css_directory = "mx_enviroments/{%0}.css";

	// prototype variables
	main.public.info_name = null;
	main.public.css_node = null;
	main.public.nodes = [];

	main.public.__constructor = function (info_file) {
		if (info_file) {
			this.load(info_file);
			this.css(info_file);
		}

		this.info_name = info_file;
	};

	// holds all types of enviroment pieces
	// go a given earth and their settings
	main.public.env_map = {};

	// loads a styles list that holds env_map
	// information
	main.public.load = function (file) {
		var raw_data = self.file.read(stringf(main.static.ini_directory, file));
		var env_data = self.file.ini_parse(raw_data);

		// clean up some of the data
		for (var env in env_data) {
			env_data[ env ].solid = env_data[ env ].solid ? mh.truthy(env_data[ env ].solid) : false;
			env_data[ env ].move = env_data[ env ].move ? mh.truthy(env_data[ env ].move) : false;
			env_data[ env ].loop = env_data[ env ].loop ? mh.truthy(env_data[ env ].loop) : false;
		}
		
		// store the information
		this.env_map = env_data;
	};

	main.public.css = function (file) {
		this.css_node = self.include.register(
			stringf(main.static.css_directory, file), 
			self.include.CSS
		);
	};

	// applies enviroment piece settings on an enviroment node
	main.public.draw = function (on, type, no_save) {
		var elem;

		if (!(type in this.env_map))
			throw new Error("invalid draw type");

		elem = self.storage.get.enviroment_element(on);

		if (!no_save) {
			this.nodes.push({ on: on, type: type });
		}

		if (elem) {
			mh.add_class(elem.node, this.env_map[ type ].class_name);

			if (this.env_map[ type ].solid) {
				self.enviroment.element.as_solid(on, true);
			}
		}
	};

	main.public.clear = function () {
		var cell, me = this;

		mh.for_each(this.nodes, function (i, info) {
			cell = self.storage.get.enviroment_element(info.on);

			if (cell && cell.node) {
				mh.remove_class(cell.node, me.env_map[ info.type ].class_name);
				self.enviroment.element.as_solid(info.on, false);
			}
		});
	};

	// moves the whole enripoment port node list to the right
	main.public.move = function (direction) {
		// store the last version
		var node_backup = this.nodes;
		var offset = direction === self.enviroment.movement.direction.RIGHT ? 1 : -1;
		var me = this;

		// get the moving elements
		var moving_parts = mh.filter(mh.map(this.env_map, function (a, info) {
			if (info.move) {
				return a;
			}
		}), function (a, b) {
			return b;
		});

		// get the looping elements
		var looping_parts = mh.filter(mh.map(this.env_map, function (a, info) {
			if (info.loop) {
				return a;
			}
		}), function (a, b) {
			return b;
		});

		// clear the last version
		this.clear();
		this.nodes = [];

		// move everything to the right
		mh.for_each(node_backup, function (n, info) {
			me.draw([ info.on[0] + offset, info.on[1] ], info.type);

			/* var elem_current, elem_sibling; 
			// if this is a moving part 
			if (mh.in_array(info.type, moving_parts)) {
				// first draw the element in it's new location
				me.draw([ info.on[0] + 1, info.on[1] ], info.type);

				// then take the element to the right and place
				// that where this one used to be
				elem_sibling = self.storage.get.enviroment_element([ info.on[0] - 1, info.on[1] ]);

				if (elem_sibling) {}
			}
			else
				me.nodes.push({ on: [info.on[0], info.on[1]], type: info.type }); */
		});
	};

	// draws a section of the enviromentport
	main.static.section = function (bottom_bottom_offset, top_bottom_offset) {
		var cells = [];

		bottom_bottom_offset = bottom_bottom_offset || 1;
		top_bottom_offset = top_bottom_offset || self.dom.settings.enviromentport.dimension.height;

		for (var row = bottom_bottom_offset; row <= top_bottom_offset; row++) {
			for (var column = 0; column < self.dom.settings.enviromentport.dimension.width; column++) {
				cells.push([column, self.dom.settings.enviromentport.dimension.height - row]);
			}
		}

		return cells;
	};

	main.public.piramid = function (width, xoffset, yoffset, type) {
		for (var i = 0; i < width; i++) {
			for (var j = 0; j < width - (i * 2); j++) {
				this.draw([xoffset + i + j, yoffset - i], type);
			}
		}
	};

	main.public.flag = function (woffset, hoffset, class_footer, class_pole, class_flag) {
		// flag footer
		this.draw([woffset, hoffset], class_footer);
		this.draw([woffset - 1, hoffset], class_footer);
		this.draw([woffset - 2, hoffset], class_footer);
		
		self.enviroment.element.as_used([woffset, hoffset], true);
		self.enviroment.element.as_used([woffset - 1, hoffset], true);
		self.enviroment.element.as_used([woffset - 2, hoffset], true);

		// flag pole
		this.draw([woffset - 1, hoffset - 1], class_pole);
		this.draw([woffset - 1, hoffset - 2], class_pole);
		this.draw([woffset - 1, hoffset - 3], class_pole);
		this.draw([woffset - 1, hoffset - 4], class_pole);
		this.draw([woffset - 1, hoffset - 5], class_pole);
		this.draw([woffset - 1, hoffset - 6], class_pole);
		this.draw([woffset - 1, hoffset - 7], class_pole);
		this.draw([woffset - 1, hoffset - 8], class_pole);
		this.draw([woffset - 1, hoffset - 9], class_pole);
		this.draw([woffset - 1, hoffset - 10], class_pole);
		this.draw([woffset - 1, hoffset - 11], class_pole);
		this.draw([woffset - 1, hoffset - 12], class_pole);
		this.draw([woffset - 1, hoffset - 13], class_pole);
		this.draw([woffset - 1, hoffset - 14], class_pole);

		// flag
		this.draw([woffset - 2, hoffset - 12], class_flag);
		this.draw([woffset - 3, hoffset - 12], class_flag);
		this.draw([woffset - 4, hoffset - 12], class_flag);
		this.draw([woffset - 2, hoffset - 13], class_flag);
		this.draw([woffset - 3, hoffset - 13], class_flag);
		this.draw([woffset - 4, hoffset - 13], class_flag);

		return [
			[woffset, hoffset],
			[woffset - 1, hoffset],
			[woffset - 2, hoffset]
		];
	};
})(mx);
