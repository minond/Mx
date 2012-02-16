// Mx helpers
// m
// mostly a wrapper for a typeof/gettype function
(function (father, scope) {
	"use string";
	var is = {
		_number: function (v) { return typeof v === 'number' || v instanceof Number; },
		_string: function (v) { return typeof v === 'string' || v instanceof String; },
		_object: function (v) { return typeof v === 'object' && v instanceof Object && !is._array(v) && !is._node(v) && !is._nodelist(v); },
		_an_object: function (v) { return v instanceof Object; },
		_array: function (v) { return v instanceof Array && !is._nodelist(v); },
		_function: function (v) { return v instanceof Function },
		_node: function (v) { return v instanceof Node },
		_nodelist: function (v) { return v instanceof NodeList },
		_char: function (v) {
			return is._string(v) && (v.length === 1 || ( v.length === 2 && v.charAt(0) === '\\' ));
		},
		_int: function (v) { return is._number(v) && parseInt(v) === v; },
		_float: function (v) { return is._number(v) && parseInt(v) !== v; },
		_date: function (v) { return v instanceof Date },
		_global: function (v) { return v === window; },
		_Mx: function (v) { return v === Mx; },
		_undefined: function (v) { return typeof v === "undefined" }, 
		_regex: function (v) { return v instanceof RegExp; },
		_arguments: function (v) {
			return is._object(v) && !is._array(v) && v.toString() === "[object Arguments]";
		}
	};

	var you_are = function (item, holder) {
		for (var possibility in is) {
			holder[ 'is' + possibility ] = is[ possibility ](item);
		}
	};

	var main = function (item) {
		var ret = {};

		you_are(item, ret);

		return ret;
	};


	scope['m'] = main;
})(Mx, window);



// and x
// adds functionallity to an object without
// breaking it's prototype
(function (father, scope) {
	"use string";
	var fns = {
		ar_first: function () {
			return this[0];
		},

		ar_last: function () {
			return this[ this.length - 1 ]
		},

		ar_each: function (action) {
			for (var m = this.length, i = 0; i < m; i++)
				action.call(this[i], i);
		},

		ar_reduce: function (test) {
			var pass = [];
			for (var m = this.length, i = 0; i < m; i++) {
				if (test.call(this[i], i))
					pass.push(this[i]);
			}
			return pass;
		},

		ar_rest: function () {
			var ret = [];
			for (var m = this.length, i = 1; i < m; i++)
				ret.push( this[i] );
			return ret;
		},

		ar_in_array: function (item) {
			for (var m = this.length, i = 0; i < m; i++)
				if (item === this[i])
					return true;
			return false;
		},

		obj_dump: function () {
			var pass = true;
			for (var prop in this) {
				if (m(this[prop]).is_object) {
					x(this[prop]).garbage();
				}

				pass = delete this[prop] && pass;
			}
			return pass;
		},

		obj_eq: function (comp) {
			for (var prop in comp) {
				if (!(prop in this)) {
					return false;
				}
				if (comp[prop] !== this[prop]) {
					return false;
				}
			}

			for (var prop in this) {
				if (!(prop in comp)) {
					return false;
				}
				if (comp[prop] !== this[prop]) {
					return false;
				}
		}

			return true;
		},

		obj_soft_eq: function (comp) {
			for (var prop in comp) {
				if (!(prop in this)) {
					return false;
				}
			}

			for (var prop in this) {
				if (!(prop in comp)) {
					return false;
				}
			}

			return true;
		},

		obj_each: function (action) {
			for (var prop in this)
				action.call(this, this[prop], prop);
		},

		node_style: function (cssobj) {
			for (var css in cssobj)
				this.style[ css ] = cssobj[ css ];
			return x(this);
		},

		node_hide: function () {
			x(this).style({"display":"none"});
			return x(this);
		},

		node_show: function () {
			x(this).style({"display":""});
			return x(this);
		},

		node_remove: function () {
			var mon = this.parentNode;
			mon && mon.removeChild(this);
		},

		node_append: function () {
			Mx.queue.dom(this);

			return x(this);
		},

		nodes_style: function (cssobj) {
			for (var m = this.length, i = 0; i < m; i++)
				for (var css in cssobj)
					this[i].style[ css ] = cssobj[ css ];
			return x(this);
		},

		nodes_hide: function () {
			for (var m = this.length, i = 0; i < m; i++)
				x(this[i]).style({"display":"none"});
			return x(this);
		},

		nodes_show: function () {
			for (var m = this.length, i = 0; i < m; i++)
				x(this[i]).style({"display":""});
			return x(this);
		}
	};

	var lambda = function (fnname, instance) {
		return fns[fnname].bind(instance);
	};

	var main = function (item) {
		var type = m(item), ret = {};

		if (type.is_array || type.is_nodelist) {
			ret.first    = lambda('ar_first', item);
			ret.last     = lambda('ar_last', item);
			ret.each     = lambda('ar_each', item);
			ret.reduce   = lambda('ar_reduce', item);
			ret.rest     = lambda('ar_rest', item);
			ret.in_array = lambda('ar_in_array', item);
		}

		if (type.is_object) {
			ret.garbage = lambda('obj_dump', item);
			ret.each    = lambda('obj_each', item);
			ret.eq      = lambda('obj_eq', item);
			ret.soft_eq = lambda('obj_soft_eq', item);
		}

		if (type.is_node) {
			ret.style  = lambda('node_style', item);
			ret.show   = lambda('node_show', item);
			ret.hide   = lambda('node_hide', item);
			ret.remove = lambda('node_remove', item);
			ret.append = lambda('node_append', item);
			item.x	   = ret;
		}

		if (type.is_nodelist) {
			ret.style = lambda('nodes_style', item);
			ret.show  = lambda('nodes_show', item);
			ret.hide  = lambda('nodes_hide', item);
		}

		return ret;
	};


	scope['x'] = main;
})(Mx, window);




// Game object's private scope
(function () {
	"use strict";

	// storage
	var pri = {};
	var typ = {};

	// methods
	var define, defined, unset, set, get;


	// define
	var define = Mx.define = function (varname, value, type) {
		if (defined(varname)) {
			Mx.debug.errorf("Variable '{%0}' has already been defined", varname);
			return false;
		}

		else {
			if (type) {
				typ[ varname ] = type;
			}

			pri[ varname ] = null;
		}

		(function () {
			var vname = varname;

			Mx.get.__defineGetter__(vname, function () {
				return Mx.get(vname);
			});

			Mx.set.__defineSetter__(vname, function (val) {
				return Mx.set(vname, val);
			});
		})();


		return !m(value).is_undefined ? Mx.set(varname, value) : true;
	};


	// checker
	var defined = Mx.defined = function (varname) {
		return varname in pri;
	};


	// remover
	var unset = Mx.unset = function (varname) {
		delete typ[ varname ];
		return delete pri[ varname ];
	};


	// setter
	var set = Mx.set = function (varname, value) {
		var type1, type2;

		if (!defined(varname)) {
			Mx.debug.errorf("Undefined variable '{%0}'", varname);
			return false;
		}

		else {
			// static type
			if (typ[ varname ]) {
				if ( m(typ[ varname ]).is_function ) {
					type1 = m( typ[ varname ]() );
					type2 = m( value );

					if ( x(type1).eq(type2) ) {
						pri[ varname ] = value;
						return true;
					}

					else {
						Mx.debug.errorf("Invalid type, '{%0}' is of type '{%1}'", varname, typeof typ[ varname ]());
						return false;
					}
				}
			}

			// mixed type
			else {
				pri[ varname ] = value;
			}
		}

		return true;
	};


	// getter
	var get = Mx.get = function (varname) {
		if (!defined(varname)) {
			Mx.debug.errorf("Undefined variable '{%0}'", varname);
			return false;
		}

		return pri[ varname ];
	};
})();
