"use strict";

// parses the url for regular and mx variables
// an mx variable (or setting) should be passed in the
// following format: module@setting:value
// example: http://localhost/mx/project2?load:assignment4&debug@debugging:1
// this would turn on the debugging flag for the debug module
(function (self) {
	var settings = {
		// url parsing settings
		marks: {
			qstart: "?",
			qseparator: "&",
			mseparator: "@",
			qvalue: "=",
			mvalue: ":"
		},

		// url parser function
		parse_query_string: true
	};

	var main = self.module.register("url", settings);
	var query = window.location.search.split(settings.marks.qstart)[1];

	// parameters passed using regular 
	// url syntax
	main.url_parameter = {};

	// paramters passed using mx syntanx
	// used for project settings
	main.mx_parameter = {};

	main.parse_query_string = function (query_string) {
		var parts, part, var_holder;

		if (query_string && mtype(query_string).is_string) {
			query = query_string;
		}

		// parse the query string
		// for an parameters
		if (query) {
			parts = query.split(settings.marks.qseparator);

			mh.for_each(parts, function (i, val) {
				// check for regular variables
				part = parts[i].split(settings.marks.qvalue);
				var_holder = main.url_parameter;

				// then for mx variables
				if (part.length === 1) {
					part = parts[i].split(settings.marks.mvalue);
					var_holder = main.mx_parameter;

					// check if this is a setting value
					if (part[0].search(settings.marks.mseparator) > 0) {
						// setting value
						part[2] = part[1];
						
						// setting property
						part[1] = part[0].split(settings.marks.mseparator)[1];

						// setting module
						part[0] = part[0].split(settings.marks.mseparator)[0];

						// create a new setting holder if needed
						if (!var_holder[ part[0] ])
							var_holder[ part[0] ] = {};

						// and save the setting property and value
						var_holder[ part[0] ][ part[1] ] = {
							value: part[2],
							bool: mh.truthy(part[2])
						};
					}
				}

				// save the property value pair
				if (part.length === 2) 
					var_holder[ part[0] ] = part[1];
			});
		}
	};
})(mx);
