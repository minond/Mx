alien.view_length_horizontal = 10;
alien.view_length_vertical = 0;
alien.view_area = (alien.raw_width + (alien.view_length_horizontal * 2)) * (alien.raw_height + (alien.view_length_vertical * 2));

var recalculate_character_viewport = function (character) {
	var info = {
		row: {
			start: character.offset[1] - character.view_length_vertical,
			end: character.offset[1] + character.raw_height - 1 + character.view_length_vertical
		},
		column: {
			start: character.offset[0] - character.view_length_horizontal,
			end: character.offset[0] + character.raw_width - 1 + character.view_length_horizontal
		}
	};

	var character_viewport = mx.storage.select.element(mSQL.QUERY.all, function () {
		var in_row, in_column;

		in_row = + this.node.parentNode.getAttribute(mx.dom.ids.row_index);
		in_column = + this.node.getAttribute(mx.dom.ids.col_index);

		in_row = in_row <= info.row.end && in_row >= info.row.start;
		in_column = in_column <= info.column.end && in_column >= info.column.start;
	
		return in_row && in_column;
	}, character.view_area);

	mx.storage.db[ character.holder.id ] = { "@data": character_viewport || [] };
};
