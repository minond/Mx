var mx = {};


mx.throttle = function (action, delay) {
	// function manager
	var manager = {
		ready: true,
		action: action,
		delay: delay,
		trigger: null
	};

	// call the actions
	var ready_trigger = function (manager, args) {
		manager.action.apply(window, args);
	};

	// after trigger
	var ready_reset = function (manager) {
		manager.ready = false;
	};

	// is ready
	var ready_ready = function (manager) {
		manager.ready = true;
	};

	// for next trigger
	var ready_timeout;
	var ready_timer = function (manager, arg_stack) {
		ready_timeout = setTimeout(function () {
			if (arg_stack.stack.length > 0) {
				// call the next argument list
				ready_trigger(manager, arg_stack.stack[0]);

				// and remove that same argument list
				arg_stack.stack.shift();
			}

			// finally check for other arguments
			if (arg_stack.stack.length > 0)
				ready_timer(manager, arg_stack);

			// if done, reset ready state
			else
				ready_ready(manager);
		}, manager.delay);
	};

	// for trigger calls and stacking
	var args_manager = { stack: [] };
	var stack = (function () {
		// only need to stack the arguments to pass
		// var args_manager = { stack: [] };

		// and declare our main function
		return (function (manager, args) {
			// if ready, trigger right now
			if (manager.ready) {
				ready_trigger(manager, args);
				ready_reset(manager);
				ready_timer(manager, args_manager);
			}

			// otherwise save the arguments and start the delay timer
			else {
				args_manager.stack.push(args);
				// ready_timer(manager, args_manager);
			}
		});
	})();

	// call method
	manager.trigger = function () {
		stack(manager, arguments);
		return manager.trigger;
	};

	// stack and queue reset
	manager.trigger.clear = function () {
		args_manager = { stack: [] };
		clearTimeout(ready_timeout);
		ready_timer(manager, args_manager);
	};

	// pause executions
	manager.trigger.pause = function () {
		clearTimeout(ready_timeout);
		ready_timer(manager, { stack: [] });
	};

	// continue executions
	manager.trigger.resume = function () {
		if (args_manager.stack.length)
			manager.trigger.apply(window, args_manager.stack.shift());

	};

	// and save trigger function
	return manager.trigger;
};



mx.lqueue = new function () {
	this.stack = mx.throttle(function (fn) {
		fn();
	}, 150);
};



mx.require = (function (modlist) {
	var main = {};

	var nscript = function (src) {
		mx.lqueue.stack(function () {
			var node = document.createElement("script");
			node.type = "text/javascript";
			node.src = src + "?" + Date.now();
			document.head.appendChild(node);
		});
	};

	main.module = function (mod) {
		nscript("mx_module/Mx." + mod + ".js");
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
	"loader", "queue", "slave", 
	"storage", "tests" ]);
