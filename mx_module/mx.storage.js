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

			// from mx.element.type
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

// query counter/tracker
mx.storage.count = 1;
mx.storage.all = 0;
mx.storage.avg = 0;
mx.storage.last_n_max = 10;
mx.storage.last_n = [];

// wrapper for mSQL.select from element
mx.storage.select.element = function (columns, filters, limit, flat) {
	if (x(columns).is_function || !columns) {
		filters = arguments[0];
		limit = arguments[1];
		flat = arguments[2];
		columns = "*";
	}

	var timer = new mx.debug.Timer;
	var ret = mx.storage.select(columns, "element", filters, limit, flat);

	if (mx.storage.last_n.length >= mx.storage.last_n_max) {
		mx.storage.last_n.shift();
	}
	
	mx.storage.last_n.push(timer());
	mx.storage.all += timer();
	mx.storage.avg = mx.storage.all / ++mx.storage.count;

	mx.out.query.average( mx.storage.avg.toFixed(3) );
	mx.out.query.average_last( (x(mx.storage.last_n).sum() / mx.storage.count).toFixed(3) );
	mx.out.query.count( mx.storage.count );

	return ret;
};

// wrapper for mSQL.update element
mx.storage.update.element = function (columns, values, filter) {
	var ret;
	var msg = Template.stringf("update query execution time (#{%1} @{%0})", 
		Date.now().toString(), ms.storage.count++);

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

// shorcut for a node filter
mx.storage.select.element.get = function (node) {
	return mx.storage.select.element(mSQL.QUERY.all, function () {
		return this.node === node;
	}, 1)[0];
};
