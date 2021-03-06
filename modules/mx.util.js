/**
 * @name util module
 * @var Object
 */
mx.module.register("util", function (module, settings, self) {
	/**
	 * @name to_array
	 * @param Argument object
	 * @return Array
	 */
	module.to_array = function (args) {
		var ret = [];

		if (module.is.argument(args)) {
			ret = Array.prototype.slice.call(args, 0);
		}
		else if (module.is.object(args)) {
			ret = module.map(args, function (prop, value) {
				return [ prop, value ];
			});
		}
		else if (!module.is.array(args)) {
			ret = [ args ];
		}
		else {
			ret = args;
		}

		return ret;
	};

	/**
	 * @name in_array
	 * @param mixed needle
	 * @param Array haystack
	 * @return Boolean item in array
	 */
	module.in_array = function (needle, haystack) {
		return module.index_of(needle, haystack) !== false;
	};

	/**
	 * @name index_of
	 * @param mixed needle
	 * @param Array haystack
	 * @return mixed index of item, Boolean if not found
	 */
	module.index_of = function (needle, haystack) {
		var found = false;

		module.foreach(haystack, function (i, item) {
			if (item === needle) {
				found = i;
				return false;
			}
		});

		return found;
	};

	/**
	 * @name merge
	 * @param Array marge holder
	 * @param Array* marge iten
	 * @return Array merge holder
	 */
	module.merge = function (holder) {
		for (var i = 1, max = arguments.length; i < max; i++) {
			holder = holder.concat(module.to_array(arguments[ i ]));
		}

		return holder;
	};

	/**
	 * @name first
	 * @param Array list
	 * @return mixed
	 */
	module.first = function (list) {
		return list[0];
	};

	/**
	 * @name last
	 * @param Array list
	 * @return mixed
	 */
	module.last = function (list) {
		return list[ list.length - 1 ];
	};

	/**
	 * @name rest
	 * @param Array list
	 * @return Array
	 */
	module.rest = function (list) {
		var ret = []

		for (var i = 1, max = list.length; i < max; i++) {
			ret[ i - 1 ] = list[ i ];
		}

		return ret;
	};

	/**
	 * @name foreach
	 * @param Object/Array list
	 * @param Function action
	 */
	module.foreach = function (list, action) {
		if (list instanceof Array) {
			for (var i = 0, max = list.length; i < max; i++) {
				if (action(i, list[ i ]) === false) {
					break;
				}
			}
		}
		else if (list instanceof Object) {
			for (var prop in list) {
				if (action(prop, list[ prop ]) === false) {
					break;
				}
			}
		}
	};

	/**
	 * @name map
	 * @param Object/Array list
	 * @param Function action
	 * @return Array action returns
	 */
	module.map = function (list, action) {
		var ret = [];

		module.foreach(list, function (a, b) {
			ret.push(action(a, b));
		});

		return ret;
	};

	/**
	 * @name reduce
	 * @param Array list
	 * @param Function action
	 * @return Array parsed list
	 */
	module.reduce = function (list, action) {
		var ret = module.is.array(list) ? [] : {};

		module.foreach(list, function (index, item) {
			if (action(index, item) !== false) {
				if (module.is.array(list)) {
					ret.push(item);
				}
				else {
					ret[ index ] = item;
				}
			}
		});

		return ret;
	};

	/**
	 * @name range
	 * @param Integer from
	 * @param Integer to
	 * @param Integer iterator
	 * @return Array
	 */
	module.range = function (from, to, iterator) {
		var ret = [];

		if (module.is.set(to) && !module.is.set(iterator)) {
			iterator = 1;
		}
		else if (!module.is.set(to) && !module.is.set(iterator)) {
			iterator = 1;
			to = from;
			from = 0;
		}

		for (var i = from; i < to; i += iterator) {
			ret.push(i);
		}

		return ret;
	};

	/**
	 * @name next_tick
	 * @param Function method
	 * @param Array optional arguments
	 */
	module.next_tick = function (method, args, scope) {
		setTimeout(function () {
			args ? method.call(window || scope, args) : method();
		}, 0);
	};

	/**
	 * @name times
	 * @param Integer counter
	 * @param Function action
	 */
	module.times = function (counter, action) {
		return module.map(module.range(counter), action);
	};

	/**
	 * @name enumerable
	 * @param list of items
	 * @return enumerated items
	 */
	module.enumerable = (function () {
		var count = 0;
	
		return function (list) {
			var ret = {};

			module.foreach(module.to_array(arguments), function (i, item) {
				ret[ item ] = count++;
				ret[ item.toUpperCase() ] = count;

				if (ret.__defineGetter__) {
					(function (item) {
						ret.__defineGetter__(item.toUpperCase(), function () {
							return count;
						});
					})(item);
				}
			});

			return ret;
		};
	})();

	/**
	 * @name const
	 * @param list of items
	 * @return Object property getters
	 */
	module.constant = function (list) {
		var ret = {};

		module.foreach(module.to_array(arguments), function (i, item) {
			ret[ item ] = item;
			ret[ item.toUpperCase() ] = item;

			if (ret.__defineGetter__) {
				(function (item) {
					ret.__defineGetter__(item.toUpperCase(), function () {
						return item;
					});
				})(item);
			}
		});

		return ret;
	};

	/**
	 * @name Throttle
	 * @param Function action
	 * @param Integer throttled time
	 * @param Object optional scope
	 * @return Throttled varsion of action
	 */
	module.Throttle = function Throttle (action, waittime, scope) {
		var manager, timer, items = [];

		function time_next () {
			timer = setTimeout(function () {
				run_next();
			}, waittime);
		}

		function run_next () {
			if (items.length) {
				action.apply(scope || window, items.shift());
				time_next();
			}
		}

		function first_check () {
			if (!items.length) {
				time_next();
			}
		}

		manager = function () {
			first_check();
			items.push( module.to_array(arguments) );
		};

		manager.reset = function () {
			manager.pause();
			items = [];
		};

		manager.pause = function () {
			clearTimeout(timer);
		};

		manager.resume = function () {
			run_next();
		};

		return manager;
	};

	/**
	 * @name Debounce
	 * @param Function action
	 * @param Integer throttled time
	 * @param Object optional scope
	 * @return Throttled version of action
	 */
	module.Debounce = function Debounce (action, waittime, scope) {
		var timer, manager = function () {
			var args = module.to_array(arguments);

			clearTimeout(timer);

			timer = setTimeout(function () {
				action.apply(scope || window, args);
			}, waittime);
		};

		return manager;
	};

	/**
	 * @name Promise
	 * @return Promise instance
	 * @method as key setter
	 * @method when success appender
	 * @method fullfil success trigger
	 * @method fail failure appender
	 * @method squash failure trigger
	 */
	module.Promise = function Promise () {
		var key_selection = key_default = "default";
		var callbacks = [], errbacks = [];

		this.as = function (key) {
			key_selection = key || key_default;

			return this;
		};

		this.when = function (action, key) {
			callbacks.push({
				action: action,
				key: key || key_default
			});

			return this;
		};

		this.fullfil = function (args) {
			var arglist = module.to_array(arguments);
			var set_key = key_selection;

			this.as();

			module.foreach(callbacks, function (i, info) {
				if (info.key === set_key) {
					info.action.apply(window, arglist);
				}
			});

			return this;
		};

		this.fail = function (action, key) {
			errbacks.push({
				action: action,
				key: key || key_default
			});

			return this;
		};

		this.squash = function (args) {
			var arglist = module.to_array(arguments);
			var set_key = key_selection;

			this.as();

			module.foreach(errbacks, function (i, info) {
				if (info.key === set_key) {
					info.action.apply(window, arglist);
				}
			});

			return this;
		};

	};

	/**
	 * @name Trigger
	 * @return Trigger instance
	 * @method listen adds event listener
	 * @method trigger triggers event listener
	 * @method register add event key shortcuts
	 */
	module.Trigger = function Trigger () {
		var tracker = new module.Promise;

		this.listen = function (key, action) {
			tracker.when(action, key);
		};

		this.trigger = function (key, data) {
			tracker.as(key).fullfil(data);
		};

		this.register = function (key) {
			var _this = this;

			(function (key) {
				_this.trigger[ key ] = function () {
					_this.trigger(key);

					return _this;
				}

				_this.listen[ key ] = function (action) {
					_this.listen(key, action);

					return _this;
				};
			})(key);
		};
	};

	/**
	 * @name Limit
	 * @param Function action
	 * @param Integer limit
	 * @param Object method call scope
	 * @return Function limited function
	 */
	module.Limit = function (limit, action, scope) {
		var count = 0;

		return function (args) {
			if (++count <= limit) {
				action.apply(scope || window, module.to_array(args));
			}
		};
	};

	/**
	 * @name Chainable
	 * @param Object holder with methods
	 * @return Object with chainable methods
	 */
	module.Chainable = function (holder, prefix) {
		var c_value = [];

		if (!prefix) {
			prefix = "_";
		}

		for (var method in holder) {
			if (module.is.function(holder[ method ])) {
				(function (loc_method) {
					holder[ prefix + loc_method ] = function (args) {
						c_value = [ module.to_array(
							holder[ loc_method ].apply(
								holder, c_value.concat(module.to_array(arguments)))) ];
	
						return holder;
					};
				})(method);
			}
		}

		holder.__defineGetter__(prefix, function () {
			var temp = c_value[ 0 ];

			c_value = null;
			c_value = [];

			return temp;
		});
	};

	/**
	 * @name sprintf
	 * @param String template string
	 * @param mixed*
	 * @return String
	 */
	module.sprintf = function (str) {
		for (var i = 1, max = arguments.length; i < max; i++) {
			str = str.replace("%s", arguments[ i ]);
		}

		return str;
	};

	/**
	 * @name fillin
	 * @param mixed Object/Array
	 * @param mixed Object/Array
	 * @param Boolean copy
	 * @return mixed Object/Array
	 */
	module.fillin = function (checkitem, defaultitem, copy) {
		var ret = checkitem ? (copy ? module.clone(checkitem) : checkitem) : module.new_of(defaultitem);

		module.foreach(defaultitem, function (ip, val) {
			if (!module.is.set(ret[ ip ])) {
				ret[ ip ] = copy ? module.clone(val) : val;
			}

			if (module.is.loopable(ret[ ip ])) {
				module.fillin(ret[ ip ], defaultitem[ ip ], false);
			}
		});

		return ret;
	};

	/**
	 * @name clone
	 * @param mixed
	 * @return mixed
	 */
	module.clone = function (item) {
		var copy;

		if (module.is.loopable(item)) {
			copy = module.new_of(item);

			module.foreach(item, function (ip, val) {
				copy[ ip ] = module.clone(val);
			});
		}
		else {
			copy = item;
		}

		return copy;
	};

	/**
	 * @name new_of
	 * @param mixed
	 * @return mixed
	 */
	module.new_of = function (item) {
		var ret;
		var type = module.is(item);

		switch (true) {
			case type.array:
				ret = [];
				break;

			case type.function:
				ret = function () {};
				break;

			case type.object:
				ret = {};
				break;

			default:
				ret = item;
				break;
		}

		return ret;
	};

	/**
	 * @name is
	 * @var Object
	 */
	module.is = function (x) {
		var ret = {};

		for (var check in module.is) {
			if (module.is.lambda(module.is[ check ])) {
				ret[ check ] = module.is[ check ](x);
			}
		}

		return ret;
	};

	/**
	 * @name mx
	 * @var Object
	 */
	module.is.mx = {};

	/**
	 * @see is
	 */
	module.is.set = function (x) {
		return x !== void 0;
	};

	/**
	 * @see is
	 */
	module.is.regex = function (x) {
		return x instanceof RegExp;
	};

	/**
	 * @see is
	 */
	module.is.date = function (x) {
		return x instanceof Date;
	};

	/**
	 * @see is
	 */
	module.is.function = module.is.lambda = function (x) {
		return x instanceof Function;
	};

	/**
	 * @see is
	 */
	module.is.array = function (x) {
		return x instanceof Array;
	};

	/**
	 * @see is
	 */
	module.is.object = function (x) {
		return x instanceof Object && !module.is.array(x);
	};

	/**
	 * @see is
	 */
	module.is.loopable = function (x) {
		return this.object(x) || this.array(x);
	};

	/**
	 * @see is
	 */
	module.is.node = function (x) {
		return x instanceof Node;
	};

	/**
	 * @see is
	 */
	module.is.nodelist = function (x) {
		return x instanceof NodeList;
	};

	/**
	 * @see is
	 */
	module.is.string = function (x) {
		return typeof x === "string" || x instanceof String;
	};

	/**
	 * @see is
	 */
	module.is.number = function (x) {
		return (typeof x === "number" || x instanceof Number) && !isNaN(x);
	};

	/**
	 * @see is
	 */
	module.is.boolean = function (x) {
		return typeof x === "boolean";
	};

	/**
	 * @see is
	 */
	module.is.truthy = function (x) {
		return !module.is.falsy(x);
	};

	/**
	 * @see is
	 */
	module.is.falsy = function (x) {
		return module.in_array((x || 0).toString().toLowerCase(), ["no", "0", "false"]) !== false || +x === 0 || !x;
	};

	/**
	 * @see is
	 */
	module.is.integer = function (x) {
		return !!x && module.is.number(x) && parseInt(x) === x;
	};

	/**
	 * @see is
	 */
	module.is.float = module.is.double = function (x) {
		return !!x && module.is.number(x) && parseInt(x) !== x;
	};

	/**
	 * @see is
	 */
	module.is.argument = function (x) {
		return module.is.set(x) && x.toString() === "[object Arguments]";
	};

	/**
	 * @see is.mx
	 */
	module.is.mx.canvas = function (x) {
		return module.is.object(x) && "el" in x && "context" in x;
	};

	/**
	 * @name are
	 * @var Object
	 * @see is
	 */
	module.are = {};

	module.foreach(module.is, function (fn) {
		(function (fn) {
			if (module.in_array(fn, ["mx"])) {
				return;
			}

			module.are[ fn + "s" ] = function (items) {
				var are = true;

				module.foreach(arguments, function (i, val) {
					return are = are && module.is[ fn ](val);
				});

				return are;
			};
		})(fn);
	});

	module.Chainable(module, "$");
});
