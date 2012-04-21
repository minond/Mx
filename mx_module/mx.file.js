"use strict";

(function (self) {
	// needs to make an http request
	// to load files
	self.include.module.http;

	var main = self.module.register("file");

	// makes an http request to a file 
	// and returns it's content
	// request in synchronous and uses the GET
	// method with default headers
	main.read = function (file_name) {
		return self.http.async_get(file_name);
	};

	// parse an ini file
	// allows for comments and ini sections
	main.ini_parse = function (ini_string) {
		var lines = ini_string.split(/\n/);

		// holder for the parse ini values
		// and ini sections
		var ini = {};

		// string value of current section name
		var current_section;

		// comment line check
		var comment = /^;/;

		// section check
		var section = /^\[(.+?)\]$/;

		// property-value separator
		var value = "=";

		// array property check
		var array = "[]";

		// javascript eval check
		var javascript = /^\[!(.+?)\]$/;

		// holders
		var prop_name, prop_value, prop_holder;

		mh.for_each(lines, function (i, line) {
			line = line.trim();

			// check for content
			if (line) {
				// check for comments
				if (!line.match(comment)) {
					// check for section
					if (line.match(section)) {
						// this is a section declaration
						// overwrite the last section
						// and set this one as the current
						current_section = line.match(section)[1];

						// and make sure the ini object 
						// has this section 
						if (!(current_section in ini))
							ini[ current_section ] = {};
					}

					else {
						prop_name = line.split(value)[0].trim();
						prop_value = line.split(value)[1].trim();

						// holder/section check
						if (current_section)
							prop_holder = ini[ current_section ];
						else
							prop_holder = ini

						// special value checks
						if (prop_value.match(javascript)) {
							prop_value = eval(prop_value.match(javascript)[1]);
						}

						// array check
						if (prop_name.substr(prop_name.length - 2, prop_name.length) === array) {
							// update the property name
							prop_name = prop_name.substr(0, prop_name.length - 2);

							// this is an array value
							if (prop_name in prop_holder)
								prop_holder[ prop_name ].push(prop_value);
							else
								prop_holder[ prop_name ] = [prop_value];
						}
						else {
							// this is a property/value line
							prop_holder[ prop_name ] = prop_value;
						}
					}
				}
			}
		});

		return ini;
	};
})(mx);
