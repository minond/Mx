"use strict";

var t1 = [ { a: true, b: false, c: 1, d: 2 } ];
var t2 = [ { a: false, b: true, c: 2, d: 1 } ];

var mxQl = function () { this.dblist = {}; };

mxQl.prototype.load = function (table_name, table_data) {
	this.dblist[ table_name ] = table_data || [];
};

mxQl.prototype.select = function (table_name, columns, filter, limit) {
	var ret = [];
	var temp_row = {};
	var data = this.dblist[ table_name ];
	
	// search all rows
	for (var i = 0, max = data.length; i < max; i++) {
		// have we reached the limit?
		if (limit && i > limit) {
			break;
		}

		// does this row meet the criteria?
		if (filter && filter instanceof Function) {
			if (!filter.call(data[ i ]))
				continue;
		}

		// only return requested columns
		if (columns instanceof Array) {
			for (var j = 0; j < columns.length; j++)
				if (columns[ j ] in data[ i ])
					temp_row[ columns[ j ] ] = data[ i ][ columns[ j ] ];
		}
		else
			temp_row = data[ i ];

		ret.push( temp_row );
	}

	return ret;
};



var a = new mxQl;
a.load("t1", t1);
