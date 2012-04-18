var mx = {
	// settings helper functions namespage
	settings: {},

	// module helper functions namespace
	module: {},

	// module loader funtions namespace
	include: {},

	// global and module method call stack
	stack: {}
};


// file types for register method
mx.include = manage.const("module", "component", "module_parent", "project", "style", "css");

// loader functions
// used for modules, components and any other file types
mx.include.module = {};
mx.include.component = {};
mx.include.file = {};

// cache flag
mx.include.cache = false;

// used to register a module or component
mx.include.register = (function () {
	"use strict";
	
	// directories where modules and components
	// are stored
	var directories = {};
	directories[ mx.include.MODULE ] = "mx_module/mx.{%0}.js";
	directories[ mx.include.COMPONENT ] = "mx_component/mx.{%0}.js";
	directories[ mx.include.PROJECT ] = "mx_project/{%0}/main.js";

	var file_type = {};

	// javascript files
	file_type.js = {};
	file_type.js.node_tag = "script";
	file_type.js.node_type = "text/javascript";

	// css files
	file_type.css = {};
	file_type.css.node_tag = "style";
	file_type.css.node_type = "text/css";

	// requests a javascript file via a synchronous request and
	// appends to head as a script element
	var load_file = function (url, type) {
		var loader = new XMLHttpRequest;
		var script = document.createElement(file_type[ type ].node_tag);
		var success = false;

		loader.open("GET", !mx.include.cache ? url + "?" + Date.now() : url, false);
		loader.send(null);
		script.type = file_type[ type ].node_type;

		if (loader.status === 200) {
			document.head.appendChild(script);
			script.innerHTML = loader.responseText;
			success = true;
		}
		
		return success;
	};

	// components and modules are only loaded once
	// even if multiple requests are made to load it
	var loaded_files = [];

	return function (name, type, holder) {
		var url;

		switch (type) {
			// modules and components are tracked
			case mx.include.MODULE:
			case mx.include.COMPONENT:
				url = stringf(directories[ type ], name);
				holder = holder || mx.include.module;

				// settings register for modules only
				if (type === mx.include.MODULE)
					mx.settings.module[ name ] = {};

				break;

			// and so are module parent objects
			case mx.include.MODULE_PARENT:
				mx.include.module[ name ] = {};
				if (holder)
					holder[ name ] = {};

				return true;

			// for the main project, the url is generate
			// and it is loaded right away
			case mx.include.PROJECT:
				url = stringf(directories[ type ], name);
				return load_file(url, 'js');

			// css files
			case mx.include.CSS:
			case mx.include.STYLE:
				return load_file(name, 'css');

			default:
				// files are loaded right away
				return load_file(name, 'js');
		}

		// loader register
		(function () {
			var loc_url = url;
			var loc_name = name;

			(holder || mx.include).__defineGetter__(loc_name, function () {
				if (!mh.in_array(name, loaded_files)) {
					var success = false;

					// dont load it again
					loaded_files.push(name);
					success = load_file(url, 'js');

					// if this is a module, initialize it
					if (loc_name in mx) {
						if (mx[ loc_name ].initialize && mtype(mx[ loc_name ].initialize).is_function) {
							mx[ loc_name ].initialize();
						}
					}

					return success;
				}
			});
		})();
	};
})();


// an anonymous function used along with a throttle
// and the default stack time
mx.stack.frame_rate = 1000 / 16;
mx.stack.anonymous = function mx_stack (action) {
	if (mtype(action).is_function)
		action();
};

// global function stack
mx.stack.global = manage.throttle(
	mx.stack.anonymous,
	mx.stack.frame_rate
);

mx.settings.separator = ".";

// settings for all modules
mx.settings.module = (function () {
	var settings = {};
	var new_setting = {}

	var save_new_setting  = function (module, setting, value) {
		if (module in settings) {
			settings[ module ].push({
				setting: setting,
				value: value
			});
		}
		else {
			settings[ module ] = [];
			save_new_setting(module, setting, value);
		}
	};

	new_setting.set = function (setting, value) {
		var parts = setting.split(mx.settings.separator);
		var module = parts.shift();
		var settings = parts.join(mx.settings.separator);

		save_new_setting(module, settings, value);
	};

	new_setting.get = function (module) {
		return module ? settings[ module ] : settings;
	};

	return new_setting;
})();

// settings manager
mx.settings.merge = function (module) {
	"use strict";

	var default_settings = module.settings;
	var custom_settings = mx.settings.module.get(module.name);
	var setting, value, parts;

	if (custom_settings) {
		mh.for_each(custom_settings, function (i, data) {
			default_settings = module.settings;

			// walk to the setting
			parts = data.setting.split(mx.settings.separator);
			mh.for_each(parts, function (i, section) {
				if (i !== parts.length - 1) {
					default_settings = default_settings[ section ];
				}
			});

			// and update the setting value
			default_settings[ parts[ parts.length - 1 ] ] = data.value;
		});
	}
};

// settings manager for a list of settings
mx.settings.mass_merge = function (settings) {
	for (var setting in settings) {
	    if (mtype(settings[ setting ]).is_object) {
	        // check if this is module setting
	        if (setting in mx.settings.module) {
	            // if so apply custom settings
	            mh.merge(
	                mx.settings.module[ setting ],
	                settings[ setting ],
					true
	            );
			}
		}
	}
};

// function auto calling
mx.settings.functions = function (main) {
	"use strict";

	var settings = main.settings;

	for (var setting in settings) {
		if (setting in main && settings[ setting ] && mtype(main[ setting ]).is_function) {
			main[ setting ]( settings[ setting ] );
		}
	}
};

// for calculating load time
mx.settings.load_time = Date.now();

// project information
mx.settings.project_name;
mx.settings.project_load_success;
mx.settings.project_load_error = "Could not load {%0:project}.";

// adds a blank objects under mx with a name
// could also do some other normilization for modules
mx.module.register = function (module_name, settings, holder) {
	"use strict";

	// mx is the default module namespace
	holder = holder || mx;

	// create a blank module object
	// every module should have the
	// following properties:
	holder[ module_name ] = {
		name: module_name,
		settings: settings || {},
		initialize: null
	};

	// by default the initialize method only
	// applies custom settings and initializes
	// auto run functions, however, this should
	// not be over writen
	holder[ module_name ].initialize = function () {
		mx.settings.merge(holder[ module_name ]);
		mx.settings.functions(holder[ module_name ]);
		mx.out.initialized_module(module_name);
	};

	// check the global flag
	if (mx.module.global) {
		window[ module_name ] = holder[ module_name ];
	}

	// apply default settings
	mh.merge(mx.settings.module[ module_name ], settings);

	return holder[ module_name ];
};

// register method for constructor objects
// the constructor is saved in mx and the
// prototype is returned so it can be worked on
mx.module.constructor = function (name, holder) {
	"use strict";

	holder = holder || mx;
	holder[ name ] = function mxConstructor () {};

	if (mx.module.global) {
		window[ name ] = holder[ name ];
	}

	return { static: holder[ name ], public: holder[ name ].prototype };
};

// flag for determining if a module should be added
// to the global namespace or just under the mx object
mx.module.global = true;
