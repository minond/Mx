/**
 * @name util module
 * @var Object
 */
mx.module.register("util", function (module, self) {
	/**
	 * @name toarray
	 * @param Argument object
	 * @return Array
	 */
	module.toarray = function (args) {
		return Array.prototype.slice.call(args, 0);
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
	 * @name foreach
	 * @param Array list
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
	 * @param Array list
	 * @param Function action
	 */
	module.map = function (list, action) {
		var ret = [];

		module.foreach(list, function (a, b) {
			ret.push(action(a, b));
		});

		return ret;
	};

	/**
	 * @name range
	 * @param Integer from
	 * @param Integer to
	 * @return Array
	 */
	module.range = function (from, to) {
		var ret = [];

		for (var i = from; i < to; i++) {
			ret.push(i);
		}

		return ret;
	};

	/**
	 * @name times
	 * @param Integer counter
	 * @param Function action
	 */
	module.times = function (counter, action) {
		return module.map(module.range(0, counter), action);
	};
});
