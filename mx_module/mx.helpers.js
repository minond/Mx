"use strict";


// Mx helpers
// m: wrapper for a typeof function
(function () {
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
	window.m = function (item) {
		return you_are(item);
	};
})();



// and x
// adds functionallity to an object without
// breaking it's prototype
(function () {
	// holder for all helper functions for 
	// each data type
	var lambdas = {};

	// Array methods
	lambdas.is_array = {};

	// returns the first element in an array
	// @see is_array.last
	lambdas.is_array.first = function () {
		return this[0];
	};

	// returns the last element in an array
	// @see is_array.first
	lambdas.is_array.last = function () {
		return this[ this.length - 1 ]
	};

	// takes an action upon each element
	// in an array. instance is set as the correct index
	lambdas.is_array.each = function (action) {
		for (var m = this.length, i = 0; i < m; i++)
			action.call(this[i], i);
	}

	// applies the test function upon each element
	// in the array, and returns a new array made up
	// of the element on which test returned true on
	lambdas.is_array.reduce = function (test) {
		var pass = [];

		for (var m = this.length, i = 0; i < m; i++) {
			if (test.call(this[i], i))
				pass.push(this[i]);
		}

		return pass;
	};

	// returns every element except the first one
	// @see is_array.first
	// @see is_array.last
	lambdas.is_array.rest = function () {
		var ret = [];

		for (var m = this.length, i = 1; i < m; i++)
			ret.push( this[i] );

		return ret;
	};

	// returns true if the item is in the array
	lambdas.is_array.in_array = function (item) {
		for (var m = this.length, i = 0; i < m; i++)
			if (item === this[i])
				return true;

		return false;
	};

	// Object and Object like methods
	lambdas.is_object = {};

	// loops through an elements and deletes
	// each property. returns true if every 
	// property was succesfully deleted
	lambdas.is_object.dump = function () {
		var pass = true;

		for (var prop in this) {
			if (m(this[prop]).is_object)
				x(this[prop]).garbage();

			pass = delete this[prop] && pass;
		}

		return pass;
	};

	// compare two objects and their properties
	// for equality. keep equality in only done
	// or checked in the first level, meaining that
	// if a property is another object, eq does
	// not check that property's properties
	lambdas.is_object.eq = function (comp) {
		for (var prop in comp) {
			if (!(prop in this))
				return false;

			if (comp[prop] !== this[prop])
				return false;
		}

		for (var prop in this) {
			if (!(prop in comp))
				return false;

			if (comp[prop] !== this[prop])
				return false;
		}

		return true;
	};

	// compares two object and checks
	// that they have the same number and same
	// properties set. does not check for values
	// and only goes one level deep
	lambdas.is_object.soft_eq = function (comp) {
		for (var prop in comp)
			if (!(prop in this))
				return false;

		for (var prop in this)
			if (!(prop in comp))
				return false;

		return true;
	};

	// loops through each property in the object
	// and runs action upon each of them
	lambdas.is_object.each = function (action) {
		for (var prop in this)
			action.call(this, this[prop], prop);
	};

	// returns new object made up of properties
	// that passed the test function
	lambdas.is_object.reduce = function (test) {
		var ret = {};
		for (var prop in this)
			if (test(this[ prop ], prop, this))
				ret[ prop ] = this[ prop ];
		return ret;
	};

	// returns object's keys
	// @see values
	lambdas.is_object.keys = function () {
		var ret = [];
		for (var key in this)
			ret.push(key);
		return ret;
	};

	// returns object's values
	// @see keys
	lambdas.is_object.values = function () {
		var ret = [];
		for (var key in this)
			ret.push( this[ key ] );
		return ret;
	};

	// Node methods
	lambdas.is_node = {};

	// applies all css properties passed
	// in from cssobj to the current node
	lambdas.is_node.css = function (cssobj) {
		for (var css in cssobj)
			this.style[ css ] = cssobj[ css ];
		return x(this);
	};

	// sets style.display to none on the current node
	lambdas.is_node.hide = function () {
		x(this).css({"display":"none"});
		return x(this);
	};

	// resets style.display on the current node
	lambdas.is_node.show = function () {
		x(this).css({"display":""});
		return x(this);
	};

	// removes the current node from the dom
	lambdas.is_node.remove = function () {
		var mon = this.parentNode;
		mon && mon.removeChild(this);
	};

	// appends to current node to mx's viewport
	lambdas.is_node.append = function () {
		mx.queue.dom(this);
		return x(this);
	};


	// NodeList methods
	lambdas.is_nodelist = {};
	
	// applies all css properties passed
	// in from cssobj to the current nodes
	// @see is_node.style
	lambdas.is_nodelist.css = function (cssobj) {
		for (var m = this.length, i = 0; i < m; i++)
			for (var css in cssobj) {
				if ("style" in this[i])
					this[i].style[ css ] = cssobj[ css ];
				else if ("node" in this[i] && "style" in this[i].node)
					this[i].node.style[ css ] = cssobj[ css ];
			}
		return x(this);
	};

	// sets style.display to none on the current nodes
	// @see is_node.hide
	lambdas.is_nodelist.hide = function () {
		for (var m = this.length, i = 0; i < m; i++)
			x(this[i]).css({"display":"none"});
		return x(this);
	};

	// resets style.display on the current nodes
	// @see is_node.show
	lambdas.is_nodelist.show = function () {
		for (var m = this.length, i = 0; i < m; i++)
			x(this[i]).css({"display":""});
		return x(this);
	};

	// integer only numbers
	lambdas.is_int = {};

	// takes an action x number of times
	lambdas.is_int.times = function (action) {
		for (var m = this.valueOf(), i = 0; i < m; i++)
			action(i);
	};

	// returns an array of numbers for self
	// to to not including to.
	lambdas.is_int.range = function (to) {
		var ret = [];
		for (var i = this.valueOf(); i < to; i++)
			ret.push(i);
		return ret;
	};

	// @see is_array.first
	lambdas.is_nodelist.first = lambdas.is_array.first;

	// @see is_array.last
	lambdas.is_nodelist.last = lambdas.is_array.last;

	// @see is_array.each
	lambdas.is_nodelist.each = lambdas.is_array.each;

	// @see is_array.reduce
	lambdas.is_nodelist.reduce = lambdas.is_array.reduce;

	// @see is_array.rest
	lambdas.is_nodelist.rest = lambdas.is_array.rest;

	// @see is_array.in_array
	lambdas.is_nodelist.is_list = lambdas.is_array.in_array;

	// @see is_nodelist.css
	lambdas.is_array.css = lambdas.is_nodelist.css;

	// @see is_nostlist.hide
	lambdas.is_array.hide = lambdas.is_nodelist.hide;

	// @see is_nostlist.show
	lambdas.is_array.show = lambdas.is_nodelist.show;


	// takes an element and according to it's type
	// it adds new functions that are part of the
	// lambdas object
	// @see lambdas
	var upgrade = function (item) {
		var types = m(item), ret = {};

		// check each type
		for (var type in types)
			// and whe we have a match
			if (types[ type ])
				// add the new functions to the element
				for (var lambda in lambdas[ type ]) {
					ret[ lambda ] = lambdas[ type ][ lambda ].bind(item);
				}

		return ret;
	};


	// global "API"
	window.x = function (item) {
		return upgrade(item);
	};
})();
