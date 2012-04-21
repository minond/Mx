"use strict";


(function (self) {
	self.include.module.file;

	var main = self.module.constructor("Earth", mx.enviroment);

	// default directory
	main.static.directory = "mx_enviroments/{%0}.ini";

	main.public.__constructor = function (info_file) {
		if (info_file) {
			this.load(info_file);
		}
	};

	// holds all types of enviroment pieces
	// go a given earth and their settings
	main.public.env_map = {};

	// loads a styles list that holds env_map
	// information
	main.public.load = function (file) {
		var raw_data = self.file.read(stringf(main.static.directory, file));
		var env_data = self.file.ini_parse(raw_data);

		// clean up some of the data
		for (var env in env_data) {
			env_data[ env ].solid = mh.truthy(env_data[ env ].solid);
			env_data[ env ].size[0] = +env_data[ env ].size[0];
			env_data[ env ].size[1] = +env_data[ env ].size[1];
		}
		
		// store the information
		this.env_map = env_data;
	};

	// applies enviroment piece settings on an enviroment node
	main.public.draw = function (on, type) {
		var elem = self.storage.get.enviroment_element(on);

		// TODO: check size
		// TODO: check current node's use
		if (!(type in this.env_map) || !elem) {
			return false;
		}

		// TODO: create helper function for class management
		elem.node.className += " " + this.env_map[ type ].class_name;
	};
})(mx);
