"use strict";


// main holder for all modules in the library
// some helper scripts may also append to this object
var mx = {};

// project settings "namespace"
var project = {};

// default output method all modules
// should use if any sort of non-ui output
// is needed.
mx.message = function () {
	if (mx.debug) {
		mx.debug.log( Template.stringf.apply(Template, arguments) );
	}
};


// throttled function used for loading
// done by mx.include
// everything should go through this method.
mx.load_queue = new function () {
	this.stack = manage.throttle(function (fn) {
		fn();
	}, 200);
};


// main throttled call stack. similar to
// mx.load_queue, except every module extends
// from this object and uses the same call queue.
mx.queue = new function () {
	this.stack = manage.throttle(function (fn) {
		fn();
	});
};


// main loader for mx.
// includes the following objects:
// module, component, library
// module includes any mx modules
// component includes any custom components
// and library includes all possible dependancies
// and should also be a helper funciton 
// for including additional js file into the 
// project.
mx.include = (function (modlist) {
	var main = {};
	var loaded = {};
	var loc_load_queue = new manage.structure.queue;

	var nscript = function (src) {
		loaded[ src ] = true;

		loc_load_queue.enqueue(src);

		if (loc_load_queue.count === 1) {
			get_script_content(src + "?" + Date.now());
		}
	};

	var append_script = function (str_script, script_name) {
		var node = document.createElement("script");
		
		node.type = "text/javascript";
		node.innerHTML = str_script;

		mx.message("loading " + script_name);
		document.head.appendChild(node);
	};

	var get_script_content = function (src) {
		var xhr = new XMLHttpRequest;
		loc_load_queue.dequeue();

		xhr.open("GET", src, false);
		xhr.send(null);

		append_script(xhr.responseText, src);
		if (loc_load_queue.count) {
			get_script_content(loc_load_queue.dequeue());
		}
	};

	var cscript = (function (href) {
		loaded[ href ] = true;

		mx.load_queue.stack(function () {
			var node = document.createElement("link");
			node.type = "text/css";
			node.rel = "stylesheet";
			node.href = href + "?" + Date.now();
			document.head.appendChild(node);
		});
	});



	// shorcut getters for all modules
	var load_module = main.module = function (mod) {
		loaded[ mod ] = true;
		nscript("mx_module/mx." + mod + ".js");
		mx.out.module(mod);
	}

	// load limit function used within modules
	// to prevent loading the same resource
	// multiple times.
	var load_module_once = main.module.dependency = function (mod) {
		if (!(mod in loaded))
			load_module(mod);
	}


	// short cuts for all modules
	for (var i = 0; i < modlist.length; i++) {
		(function () {
			var locmod = modlist[i];

			main.module.__defineGetter__(locmod, function () {
				if (!(locmod in mx.queue))
					mx.queue[ locmod ] = {};
				load_module( locmod );
			});

			main.module.dependency.__defineGetter__(locmod, function () {
				if (!(locmod in mx.queue))
					mx.queue[ locmod ] = {};
				load_module_once( locmod );
			});
		})();
	}



	// helper setter for file loader
	main.__defineSetter__("file", function (file) {
		mx.out.file(file);
		nscript( file );
	});

	// settings loader
	main.__defineSetter__("settings", function (file) {
		nscript( file );
	});

	// default settings loader
	main.__defineGetter__("settings", function () {
		nscript( Template.stringf("{%0}/settings.js", mx.__project__) );
	});

	// dependency short cut
	main.dependency = function (file) {
		main.file = ( Template.stringf("mx_dependency/{%0}.js", file) );
	};

	// component short cut
	main.component = function (file) {
		loaded[ file ] = true;
		nscript( Template.stringf("mx_component/{%0}.js", file) );
		mx.out.component(file);
	};

	// array of components
	main.components = function (comp_array) {
		for (var i = 0; i < comp_array; i++) {
			main.component(comp_array[i]);
		}
	}

	// component dependecy loader
	main.component.dependency = function (file) {
		if (!(file in loaded))
			main.component(file);
	};

	// helper setter for style sheet loader
	main.style = function (href) {
		cscript( href );
	};

	// helper setter for loading a project
	main.__defineSetter__("project", function (pname) {
		nscript( Template.stringf("{%0}/main.js", pname) );
	});

	return main;
});


// the initializer's initializer
// shortcut for creating module loader shortcuts
mx.include.__defineSetter__("setmods", function () {
	mx.include = mx.include.apply(mx, arguments);
});

// adds ever first level property to the global scope
mx.globalize = function (quiet) {
	delete mx.globalize;
	Template.stringf.as_global();
	
	// elements
	for (var section in mx.element.map) {
		if (!(section in mx.element.factory)) {
			for (var element in mx.element.map[ section ].elements) {
				(function () {
					var loc_section = section;
					var loc_element = element;

					if (!(section in mx.element.factory))
						mx.element.factory[ section ] = {};

					mx.element.factory[ section ][ element ] = function () {
						return mx.element.factory(loc_element, loc_section);
					};
				})();
			}
		}
	}

	// modules
	for (var item in mx) {
		window[ item ] = mx[ item ];

		if (!quiet) {
			mx.debug.logf("added {%0} to global scope", item);
			mx.out.global(item);
		}
	}
};

// an anonymous function used along with a throttle
// and the default queue time
mx.queue.frame = 1000 / 16;
mx.queue.anonymous = function (action) {
	action();
};

// global function queue
mx.queue.global = manage.throttle(mx.queue.anonymous, mx.queue.frame);
