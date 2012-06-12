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
 * @name register
 * @param Object optional holder
 * @param String module name
 * @param Function
 * @return Object new mx module
 */
mx.module.register = function (holder, module, setter_method) {
	if (!setter_method) {
		setter_method = module;
		module = holder;
		holder = mx;
	}

	if (module in holder) {
		throw new Error("Cannot overwrite module.");
	}

	holder[ module ] = {
		settings: {
			set: function (key, value) {
				return key in this ? this[ key ] = value : false;
			},

			get: function (key) {
				if (!key) {
					return mx.util.reduce(mx.util.map(this, function (setting, value) {
						return setting;
					}), function (index, setting) {
						return mx.util.in_array(setting, ["get", "set"]) === false;
					});
				}

				return key in this ? this[ key ] : void 0;
			}
		}
	};

	setter_method.apply(mx, [ holder[ module ], holder[ module ].settings, mx ]);
};
