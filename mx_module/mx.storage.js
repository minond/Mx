"use strict";


mx.include.module.dependency.debug;


// currently storing everything into one element object
// could separate different elements into separate object
// in the future. should add a separate table to store
// user(s) information. could also hook up to sessionStorage
// for caching of basic data. could also keep a view state
mx.storage = (new mSQL).use({
	element: {
		"@description": {
			// should be same as Node.id
			id: String,

			// from mx.element_type
			type: Number,

			// array of view port coordinates
			offset: Array,

			// reference to element, Node
			node: Node,

			// reference to parent element
			// note: father is not always the same as
			// Node.parentNode
			father: Node
		},

		"@data": []
	}
});



// wrapper for mSQL.select from element
mx.storage.select.element = function (filters) {
	var ret, msg = "select query execution time";

	mx.debug.time(msg);
	ret = mx.storage.select("*", "element", filters);
	mx.debug.time(msg);

	return ret;
};

// wrapper for mSQL.update element
mx.storage.update.element = function (columns, values, filter) {
	var ret, msg = "update query execution time";

	mx.debug.time(msg);
	ret = mx.storage.update("element", columns, values, filter);
	mx.debug.time(msg);

	return ret;
};

// wrapper for mSQL.insert into element
mx.storage.insert.element = function (newimage) {
	mx.storage.insert.apply(mx.storage, [newimage, "element"]);
};

// shortcut to db object holding elements in mSQL
mx.storage.select.element.__defineGetter__("count", function () {
	return mx.storage.db.element["@data"].length;
});
