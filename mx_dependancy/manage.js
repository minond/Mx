(function (scope, module, undefined) {
	// first, reset the module
	scope[ module ] = null;

	// main object
	var main = {};

	// main functions
	// main.throttle;
	// main.limit;


	// @name: limit
	// @param: function action
	// @param: int limit
	main.limit = function (action, limit) {
		return (function () {
			var count = 0;
			
			return (function () {
				var manager = {
					limit: limit,
					action: action,
					trigger: null
				};

				manager.trigger = function () {
					if (count++ < manager.limit)
						manager.action.apply(window, arguments);
				};

				return manager.trigger;
			})();
		})();
	};

	// @name: throttle
	// @param: function action
	// @param: int delay
	main.throttle = function (action, delay) {
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
		return manager;
	};
	
	
	// @name: data
	// @item: session
	main.data = Data = {
		session: function (key, value) {
			var response, bad = false, storage = "sessionStorage";
	
			// first we find a place to store data.
			// check that we're working with an object
			// if not, we are currently on an older
			// browser so we save our data to window.name
			if (!("Storage" in window && window[storage] instanceof Storage))
				if (!window[storage] || !(window[storage] instanceof Object)) {
					bad = true;
					window[storage] = JSON.parse(window.name ? window.name : "{}");
				}
	
			// now that we have a place to store
			// data and get data from we continue
			// with the function.
			// if we have a value parameter, we save it,
			response = (value ? window[storage][key] = value : (key in window[storage] ? window[storage][key] : undefined));

			// save data to window.name when needed
			if (bad)
				window.name = JSON.stringify(window[storage]), window[storage] = null;
	
			return response;
		}
	};


	// @name: structure
	// @item: stack
	// @item: queue
	main.structure = Structure = (function structure () {
		var i_c = function (m) {
			m.count++;
		};

		var d_c = function (m) {
			m.count && m.count--;
		}
	
		var S_push = function (list, item) {
			list.push(item);
		};

		var S_pop = function (list) {
			return list.pop();
		};
	
		var Q_push = function (list, item) {
			list.push(item);
		};
	
		var Q_pop = function (list) {
			return list.shift();
		}
	
		return ({
			stack: function () {
				var list = [];
				this.count = 0;
	
				this.push = function (item) {
					i_c.apply(this, [this]);
					S_push(list, item);
					return this;
				};
	
				this.pop = function () {
					d_c.apply(this, [this]);
					return S_pop(list);
				};
			},

			queue: function () {
				var list = [];
				this.count = 0;
	
				this.enqueue = function (item) {
					i_c.apply(this, [this]);
					Q_push(list, item);
					return this;
				};
	
				this.dequeue = function () {
					d_c.apply(this, [this]);
					return Q_pop(list);
				};
			},
			
			Stack: function () {
				return new Structure.stack;
			},
			
			Queue: function () {
				return new Structure.queue;
			}
		});
	})();
	

	var enum_counter = 0;
	main.enum = function (holder) {
		var map = {};

		for (var i = 0; i < arguments.length; i++)
			map[ arguments[i] ] = i + enum_counter;

		enum_counter += i;
		
		return map;
	};


	main.const = function () {
		var map = {};

		for (var i = 0; i < arguments.length; i++)
			map[ arguments[i].toUpperCase() ] = arguments[i];

		return map;
	};


	main.as_global = function () {
		for (var item in main) {
			// nothing is over written
			if (item in scope)
				throw new Error("cannot overwrite variable " + item + " in global scope.");
			else
				scope[ item ] = main[ item ];
		}
	};

	// and send back to parent scope
	scope[ module ] = main;
})(this, 'manage');
