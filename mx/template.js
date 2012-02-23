"use strict";

var Template = (function (global_scope) {
	var main = {};
	var Templates = main.raw = {};
	var Settings = main.conf = {
		proto: this,
		strict: true,
		value_separator: ":",
		var_parser: /\{\%.+?}/g
	};

	var var_cleaner = function (v) { return v.substr(2, v.length - 3); }
	var vars_cleaner = function (vs) {
		var map;

		for (var i = 0, m = vs.length; i < m; i++)
			map = var_cleaner(vs[ i ]).split( Settings.value_separator ),
			vs[ i ] = { m: vs[ i ], v: map[0], d: map[1] };

		return vs;
	};



	main.register = function (template_id, template_str) {
		Templates[ template_id ] = template_str;
		return main;
	};

	main.build = function (template_id, merge_fields) {
		// does this template exist?
		if (!(template_id in Templates))
			return "";

		var temp, fields = {};

		// and are we working with an object?
		if (!(merge_fields instanceof Object) || merge_fields instanceof Array) {
			// or an array?
			if (merge_fields instanceof Array) {
				temp = "";

				// build each row individually and concatenate together
				for (var i = 0, m = merge_fields.length; i < m; i++)
					temp += main.build(template_id, merge_fields[i]);

				return temp;
			}

			else {
				// if not, compile the arguments into an object
				for (var i = 1, m = arguments.length; i < m; i++)
					fields[ i - 1 ] = arguments[i];
			
				// and try again
				return main.build(arguments[0], fields);
			}
		}


		temp = Templates[ template_id ];
		fields = vars_cleaner( temp.match( Settings.var_parser ) || [] );

		// parse the string and replace all merge fields
		for (var i = 0, m = fields.length; i < m; i++)
			// replace a merge field for an actual value
			if (fields[ i ].v in merge_fields)
				temp = temp.replace(fields[ i ].m, merge_fields[ fields[ i ].v ]);
			// if that value is missing, clear the merge field
			else if (Settings.strict)
				temp = temp.replace(fields[ i ].m, fields[ i ].d || "");


		return temp;
	};

	// shortcut/helper function
	main.stringf = function (str) {
		main.register(str, str);
		if (typeof arguments[1] === "object")
			return main.build(str, arguments[1]);
		else
			return main.build.apply(main, arguments);
	};

	main.stringf.as_global = function () {
		if ('stringf' in global_scope)
			throw new Error('cannot overwrite stringf variable in global scope');
		else
			global_scope.stringf = main.stringf;
	};

	return main;
})(this);
