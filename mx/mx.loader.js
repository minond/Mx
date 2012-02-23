// main holder for all modules in the library
// some helper scripts may also append to this object
var mx = {};

var mx_modules = [	"component", "debugger", "dom", 
					"driver", "events", "element", 
					"loader", "queue", "helpers", 
					"storage", "tests" ];


// default output method all modules
// should use if any sort of non-ui output
// is needed.
mx.message = function () {
	if (mx.debug) {
		mx.debug.log.apply(mx, arguments);
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

	var nscript = function (src) {
		mx.load_queue.stack(function () {
			var node = document.createElement("script");
			node.type = "text/javascript";
			node.src = src + "?" + Date.now();
			document.head.appendChild(node);
		});
	};

	var cscript = (function (href) {
		mx.load_queue.stack(function () {
			var node = document.createElement("link");
			node.type = "text/css";
			node.rel = "stylesheet";
			node.href = href;
			document.head.appendChild(node);
		});
	});



	// shorcut getters for all modules
	var load_module = main.module = function (mod) {
		nscript("mx_module/mx." + mod + ".js");
	}


	// short cuts for all modules
	for (var i = 0; i < modlist.length; i++) {
		(function () {
			var locmod = modlist[i];
			main.module.__defineGetter__(locmod, function () {
				load_module( locmod );
			});
		})();
	}



	// helper setter for configuration loader
	main.__defineSetter__("settings", function (file) {
		nscript( file );
	});

	// helper setter for style sheet loader
	main.__defineSetter__("style", function (href) {
		cscript( href );
	});

	return main;
})( mx_modules );
