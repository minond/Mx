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
		var elem = self.storage.get.enviroment_element(on);

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
})(mx);
