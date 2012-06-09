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

	holder[ module ] = {};
	setter_method.apply(mx, [ holder[ module ], mx ]);
};
