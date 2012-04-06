var mx = {
	// for calculating load time
	load_time: Date.now(),

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
mx.include = manage.const("module", "component", "module_parent", "project");

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
	directories[ mx.include.PROJECT ] = "{%0}/main.js";

	var file_type = {};
	file_type.js = {};
	file_type.js.node_tag = "script";
	file_type.js.node_type = "text/javascript";

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
			case mx.include.MODULE:
			case mx.include.PROJECT:
			case mx.include.COMPONENT:
				url = stringf(directories[ mx.include.MODULE ], name);
				holder = holder || mx.include.module;

				// settings register for modules only
				if (type === mx.include.MODULE)
					mx.settings.module[ name ] = {};

				break;

			case mx.include.MODULE_PARENT:
				if (holder)
					holder[ name ] = {};
				else
					mx.include.module[ name ] = {};
				break;

			default:
				url = name;
				break;
		}

		// loader register
		(function () {
			var loc_url = url;
			var loc_name = name;

			(holder || mx.include).__defineGetter__(loc_name, function () {
				if (!mh.in_array(name, loaded_files)) {
					loaded_files.push(name);
					return load_file(url, 'js');
				}
			});
		})();
	};
})();


// an anonymous function used along with a throttle
// and the default stack time
mx.stack.frame_rate = 1000 / 16;

// global function stack
mx.stack.global = manage.throttle(
	function mx_stack (action) { action(); },
	mx.stack.frame_rate
);

// settings for all modules
mx.settings.module = {};

// settings manager
mx.settings.merge = function (module) {
	"use strict";

	var default_settings = module.settings;
	var custom_settings = mx.settings.module[ module.name ];

	for (var setting in custom_settings) {
		default_settings[ setting ] = custom_settings[ setting ];
	}

	for (var setting in default_settings) {
		custom_settings[ setting ] = default_settings[ setting ];
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

// adds a blank objects under mx with a name
// could also do some other normilization for modules
mx.module.register = function (module_name, settings) {
	// create a blank module object
	// every module should have the
	// following properties:
	mx[ module_name ] = {
		name: module_name,
		settings: settings || {},
		initialize: null
	};

	// by default the initalize method only
	// applies custom settings and initalizes
	// auto run functions, however, this could
	// be over writen
	mx[ module_name ].initialize = function () {
		mx.settings.merge(mx[ module_name ]);
		mx.settings.functions(mx[ module_name ]);
	};

	// check the global flag
	if (mx.module.global) {
		window[ module_name ] = mx[ module_name ];
	}

	return mx[ module_name ];
};

// register method for constructor objects
// the constructor is saved in mx and the
// prototype is returned so it can be worked on
mx.module.constructor = function (name) {
	mx[ name ] = function mxConstructor () {};
	return mx[ name ];
};

// flag for determining if a module should be added
// to the global namespace or just under the mx object
mx.module.global = true;
