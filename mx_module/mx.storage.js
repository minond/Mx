"use strict";


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
	return mx.storage.select("*", "element", filters);
};

// wrapper for mSQL.insert into element
mx.storage.insert.element = function (newimage) {
	mx.storage.insert.apply(mx.storage, [newimage, "element"]);
};
