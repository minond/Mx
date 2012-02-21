var mx = {};

mx.message = function () {
	if (mx.debug) {
		mx.debug.log.apply(mx, arguments);
	}
};

mx.load_queue = new function () {
	this.stack = manage.throttle(function (fn) {
		fn();
	}, 150);
};



mx.require = (function (modlist) {
	var main = {};

	var nscript = function (src) {
		mx.load_queue.stack(function () {
			var node = document.createElement("script");
			node.type = "text/javascript";
			node.src = src + "?" + Date.now();
			document.head.appendChild(node);
		});
	};

	main.module = function (mod) {
		nscript("mx_module/mx." + mod + ".js");
	}


	// short cuts for all modules
	for (var i = 0; i < modlist.length; i++) {
		(function () {
			var locmod = modlist[i];
			main.module.__defineGetter__(locmod, function () {
				main.module( locmod );
			});
		})();
	}

	return main;
})([ 
	"component", "debugger", "dom", 
	"driver", "events", "images", 
	"loader", "queue", "helpers", 
	"storage", "tests" ]);
