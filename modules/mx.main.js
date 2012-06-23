/**
 * @name mx
 * @var Object
 */
var mx = {};

/**
 * @name module
 * @var Object
 */
mx.module = {};

/**
 * @name constructor
 * @param Object optional holder
 * @param string constructor name
 * @param Function
 * @return Object new mx constructor
 */
mx.module.constructor = function (holder, module, setter_method) {
	var mod;

	if (!setter_method) {
		setter_method = module;
		module = holder;
		holder = mx;
	}

	if (module in holder) {
		throw new Error("Cannot overwrite module " + module);
	}

	mod = new this.template_module;

	holder[ module ] = function $mx (argv) {
		var argv = arguments;

		if (!argv.length) {
			argv = [ {} ];
		}

		if (this.__construct) {
			this.__construct.apply(this, mx.util.to_array(argv));
		}
	};

	if (setter_method) {
		holder[ module ].settings = mod.module.settings;
		setter_method.apply(mx, [ holder[ module ], holder[ module ].prototype, mod.storage, mx ]);
	}

	return holder[ module ];
};

/**
 * @name register
 * @param Object optional holder
 * @param String module name
 * @param Function
 * @return Object new mx module
 */
mx.module.register = function (holder, module, setter_method) {
	var mod;

	if (!setter_method) {
		setter_method = module;
		module = holder;
		holder = mx;
	}

	if (module in holder) {
		throw new Error("Cannot overwrite module " + module);
	}

	mod = new this.template_module;
	holder[ module ] = mod.module;

	if (setter_method) {
		setter_method.apply(mx, [ holder[ module ], mod.storage, mx ]);
	}

	return holder[ module ];
};

/**
 * @name template_module
 * @return Object default module object
 */
mx.module.template_module = function () {
	var defs = ["get", "set", "defaults"];

	return (function () {
		var storage = {
			defaults: {}
		};

		return {
			storage: storage,
			module: {
				settings: {
					add: function (key, value) {
						return !(key in storage) && !mx.util.in_array(key, defs) ? storage[ key ] = value : false;
					},

					set: function (key, value) {
						return key in storage && !mx.util.in_array(key, defs) ? storage[ key ] = value : false;
					},

					get: function (key) {
						if (!key) {
							return mx.util.reduce(mx.util.map(storage, function (setting, value) {
								return setting;
							}), function (index, setting) {
								return !mx.util.in_array(setting, defs);
							});
						}

						return key in storage ? storage[ key ] : void 0;
					}
				}
			}
		};
	})();
};
