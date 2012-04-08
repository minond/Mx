"use strict";


// namespace for helper functions
// that are used throughout modules
// and is not part of a particular one.
var mh = {};

// checks array for value
mh.in_array = function (needle, haystack) {
	var match = false;

	for (var i = 0, max = haystack.length; i < max; i++) {
		if (haystack[i] === needle) {
			match = true;
			break;
		}
	}

	return match;
};

// returns all but the first element in a
// array or arguments object
mh.rest = function (list) {
	return Array.prototype.splice.call(list, 1);
};

// merges properties and values of an object
// into another object
mh.merge = function (merge_into, merge_from) {
	if (mtype(merge_from).is_object && mtype(merge_into).is_object) {
		for (var prop in merge_from) {
			if (!(prop in merge_into))
				merge_into[ prop ] = merge_from[ prop ];
		}
	}

	return merge_into;
};

// iterates over an array or object
mh.for_each = function (list, action) {
	if (mtype(list).is_array || mtype(list).is_arguments) {
		for (var i = 0, max = list.length; i < max; i++)
			action(i, list[i]);
	}
	else if (mtype(list).is_an_object) {
		for (var prop in list)
			action(prop, list[ prop ]);
	}
};

// creates a new array with items in first argument
mh.to_array = function (list) {
	var new_list = [];

	this.for_each(list, function (count, val) {
		new_list.push(val);
	});

	return new_list;
};

// convert a "truthy" value into a boolean
mh.truthy = function (val) {
	return !this.falsy(val);
}

// convert a "falsy" value into a boolean
mh.falsy = function (val) {
	return this.in_array(
		val,
		[0, "0", false, "false", null, "null", undefined, "undefined"]
	);
}

// returns all but first (array) arguments
mh.arg_shift = function (list) {
	return this.rest(this.to_array(list));
};

// returns an argument object as an array with a first new element
mh.arg_unshift = function (list, newelem) {
	var temp = this.to_array(list);
	temp[0] = newelem;
	return temp;
};


// m: wrapper for a typeof function
var mtype = (function () {
	// compares item to each condition in the 'is' object
	// returning another object made up or boolean properties
	// describing the original element
	// @see you_are
	var is = {
		_number: function (v) {
			return typeof v === 'number' || v instanceof Number; 
		},

		_string: function (v) {
			return typeof v === 'string' || v instanceof String;
		},

		_object: function (v) {
			return	typeof v === 'object' && 
					v instanceof Object && 
					!is._array(v) && 
					!is._node(v) && 
					!is._nodelist(v);
		},

		_an_object: function (v) {
			return v instanceof Object;
		},

		_array: function (v) {
			return	v instanceof Array && 
					!is._nodelist(v);
		},

		_function: function (v) {
			return v instanceof Function
		},

		_node: function (v) {
			return v instanceof Node
		},

		_nodelist: function (v) {
			return v instanceof NodeList
		},

		_char: function (v) {
			return	is._string(v) && 
					(v.length === 1 || 
						( v.length === 2 && v.charAt(0) === '\\' ));
		},

		_int: function (v) {
			return	is._number(v) && 
					parseInt(v) === v;
		},

		_float: function (v) {
			return	is._number(v) && 
					parseInt(v) !== v;
		},

		_date: function (v) {
			return v instanceof Date
		},

		_global: function (v) {
			return v === window;
		},

		_mx: function (v) {
			return v === mx;
		},

		_character: function (v) {
			return mx.element && mx.element.character && v instanceof mx.element.character;
		},

		_undefined: function (v) {
			return typeof v === "undefined"
		}, 

		_regex: function (v) {
			return v instanceof RegExp;
		},

		_arguments: function (v) {
			return	is._object(v) && 
					!is._array(v) && 
					v.toString() === "[object Arguments]";
		}
	};


	// compares item to each condition in the 'is' object
	// returning another object made up or boolean properties
	// describing the original element
	// @see is
	var you_are = function (item, holder) {
		holder = holder || {};

		for (var possibility in is)
			holder[ 'is' + possibility ] = is[ possibility ](item);

		return holder;
	};


	// global "API"
	return function (item) {
		return you_are(item);
	};
})();
