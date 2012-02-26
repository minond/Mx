"use strict";


// main holder for all modules in the library
// some helper scripts may also append to this object
var mx = {};


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
	}, 150);
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

	var nscript = function (src) {
		loaded[ src ] = true;

		mx.load_queue.stack(function () {
			var node = document.createElement("script");
			node.type = "text/javascript";
			node.src = src + "?" + Date.now();
			document.head.appendChild(node);
		});
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
	main.__defineSetter__("dependency", function (file) {
		nscript( Template.stringf("mx_dependency/{%0}.js", file) );
	});

	// component short cut
	main.component = function (file) {
		loaded[ file ] = true;
		nscript( Template.stringf("mx_component/{%0}.js", file) );
	};

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

	// adds an action/function to the call stack
	mx.queue.__defineSetter__("action", function (fn) {
		setTimeout(function () {
			if (m(fn).is_function)
				mx.load_queue.stack(fn);
		}, 500);
	});

	// calls a function in x seconds
	mx.queue.__defineSetter__("delay", function (fn) {
		setTimeout(function () {
			if (m(fn).is_function)
				setTimeout(function () {
					fn();
				}, 500);
		}, 500);
	});

	// TODO: remove this function all together and just
	// keep main.delay
	mx.queue.__defineSetter__("action_s", function (fn) {
		setTimeout(function () {
			mx.queue.action = fn;
		}, 500);
	});

	// set setter for variables main and setup.
	// these should be declared after every module
	// has been requeuested as they will be placed
	// in the load queue right away.
	(function () {
		__defineSetter__("main", function (fn) {
			mx.message("set main");
			setTimeout(function () {
				mx.queue.delay = fn;
			}, 750);
		});

		__defineSetter__("setup", function (fn) {
			mx.message("set setup");
			setTimeout(function () {
				mx.queue.delay = fn;
			}, 250);
		});
	})();


	return main;
});


mx.include.__defineSetter__("setmods", function () {
	mx.include = mx.include.apply(mx, arguments);
});
