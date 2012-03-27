alien.view_length_horizontal = 10;
alien.view_length_vertical = 0;
alien.view_area = (alien.raw_width + (alien.view_length_horizontal * 2)) * (alien.raw_height + (alien.view_length_vertical * 2));

var info = {
	row: {
		start: alien.offset[1] - alien.view_length_vertical,
		end: alien.offset[1] + alien.raw_height - 1 + alien.view_length_vertical
	},
	column: {
		start: alien.offset[0] - alien.view_length_horizontal,
		end: alien.offset[0] + alien.raw_width - 1 + alien.view_length_horizontal
	}
};

var env1 = mx.storage.select.element(mSQL.QUERY.all, function () {
	var in_row, in_column;

	in_row = + this.node.parentNode.getAttribute(mx.dom.ids.row_index);
	in_column = + this.node.getAttribute(mx.dom.ids.col_index);

	in_row = in_row <= info.row.end && in_row >= info.row.start;
	in_column = in_column <= info.column.end && in_column >= info.column.start;

	return in_row && in_column;
}, alien.view_area);

mx.storage.db.element["@data"] = env1;



