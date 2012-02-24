"use strict";

var script = (function reset (throttle_min) {
	var stack = new manage.structure.stack;
	
	var script_node = function (node, src) {
		node.type = "text/javascript";
		node.src = src;
		
		return node;
	};
	
	var append_node = function (node) {
		document.getElementsByTagName("head")[0].appendChild(node);
	};
	
	var listen_load = function (node, msg) {
		var try_run = function () {
			stack.count && run();

			if (main.out_done) {
				if (main.out_done === true)
					console.log(Date.now(), "loaded: " + msg);
				else if (main.out_done instanceof Function)
					main.out_done(node, msg);
			}
		};

		if (main.out_start) {
			if (main.out_start === true)
				console.log(Date.now(), "including: " + msg);
			else if (main.out_start instanceof Function)
				main.out_start(node, msg);
		}


		if ("addEventListener" in node) {
			node.addEventListener("load", function () {
				try_run();
			}, true);
		}

		else {
			node.onreadystatechange = function () {
				if (/loaded|complete|done/.test(node.readyState)) {
					try_run();
				}
			};
		}
	};
	
	var runner = function () {
		var node = document.createElement("script"),
			file = stack.pop();
		
		if (typeof file.src === "string") {
			script_node(node, file.src + (main.no_cache ? "?" + Date.now() : ""));
			append_node(node);
			listen_load(node, file.msg || file.src);
		}
		
		else if (file.src instanceof Function) {
			file.src();
			stack.count && run();
		}
	};

	// both the initiator and the runner functions
	// will be throttled
	var run = manage.throttle(runner, throttle_min);
	
	var script_loader = function (src, msg) {
		// always add to our files stack
		// and if we only have one item, add it right away,
		// otherwise wait for parent script
		stack.push({src: src, msg: msg}).count === 1 && run();
	};
	
	var main = {
		out_done: true,
		out_start: true,
		no_cache: false,
		include: script_loader,
		require: manage.throttle(script_loader, throttle_min),
		reset: reset
	};

	return main;
})(100);
