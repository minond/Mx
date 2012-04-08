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
						// this is a property/value line
						if (current_section)
							ini[ current_section ][ line.split(value)[0].trim() ] =
								line.split(value)[1].trim();
						
						else
							ini[ line.split(value)[0].trim() ] =
								line.split(value)[1].trim();
					}
				}
			}
		});

		return ini;
	};
})(mx);
