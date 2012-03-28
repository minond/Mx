"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.element;
mx.include.module.dependency.movement;
mx.include.module.dependency.character;
mx.include.module.dependency.sound;

mx.movement = (function () {
	var main = {};
	var dir_names = {};
	var selected_character;

	mx.sound.register("crash.mp3");
	mx.out.register("character_movement_recalc", "movement module", "view recalculation ({%0}ms)", "#FF1A00");

	main.initialize = function (settings) {
		for (var setting in settings) {
			if (setting in main) {
				if (m(main[ setting ]).is_function && settings[ setting ])
					main[ setting ]();
				else
					main[ setting ] = settings[ setting ];
			}
		}
	};

	main.select = function (character) {
		if (m(character).is_character)
			selected_character = character;
		else 
			selected_character = null;

		return true;
	};

	// keyboard shortcuts
	main.shortcuts = function () {
		var keys = [
			mx.events.shortcuts.left_arrow,
			mx.events.shortcuts.right_arrow,
			mx.events.shortcuts.down_arrow,
			mx.events.shortcuts.up_arrow
		];

		mx.events.shortcut(mx.events.shortcuts.left_arrow, function () {
			if (selected_character) {
				selected_character._move.clear();
				selected_character.move_left();
			}
		});
	
		mx.events.shortcut(mx.events.shortcuts.right_arrow, function () {
			if (selected_character) {
				selected_character._move.clear();
				selected_character.move_right();
			}
		});
	
		mx.events.shortcut(mx.events.shortcuts.up_arrow, function () {
			if (selected_character) {
				selected_character._move.clear();
				selected_character.move_up();
			}
		});

		mx.events.shortcut(mx.events.shortcuts.down_arrow, function () {
			if (selected_character) {
				selected_character._move.clear();
				selected_character.move_down();
			}
		});

		mx.events.bind.keyup(function (e) {
			if (x(keys).in_array(e.keyCode) && selected_character)
				selected_character._move.clear();
		});

		return true;
	};

	// click selectors
	main.clicks = function () {
		mx.events.click_on(".mx_character_body_part", function () {
			main.select( mx.element.character.characters[ this.parentNode.id ] );
		});

		mx.events.click_on(".mx_character", function () {
			main.select( mx.element.character.characters[ this.id ] );
		});
	};

	// movent cache
	mx.element.character.prototype.movement = { ready: false };
	for (var dir in mx.placement.direction) {
		mx.element.character.prototype.movement[ dir ] = true;
	}

	// move a character
	mx.element.character.prototype.move = function (dir) { this._move(this, dir); };

	// stop a character
	mx.element.character.prototype.stop = function () { this._move.clear(); };

	// updates to character element
	mx.element.character.prototype._move = manage.throttle(function (_this, dir, no_recalc) {
		var to_element, to_offset = x(_this.offset).copy();
		var direction = mx.placement.direction;
		var table = "element";

		if (_this.view_range_bit) {
			table = _this.holder.id;
		}

		// clear the move call stack
		// the move often this stack the less lag there will be
		_this._move.clear();

		// check if the element is in the viewport
		if (!_this.movement.ready) {
			return false;
		}

		// create this new direction
		if (!(dir in _this.movement))
			_this.movement[ dir ] = true;

		// check if we have tried moving here in the previous move
		if (!_this.movement[ dir ]) {
			mx.movement.recalculate_character_viewport(_this);

			if (!no_recalc)
				_this._move(_this, dir, true);

			return false;
		}

		if (dir) {
			switch (dir) {
				case direction.up:
					to_offset[1]--;
					break;
				case direction.down:
					to_offset[1]++;
					break;
				case direction.left:
					to_offset[0]--;
					break;
				case direction.right:
					to_offset[0]++;
					break;
			}

			to_element = mx.storage.select(["node", "offset"], table, function () {
				return x(this.offset).eq(to_offset);
			}, 1)[0];

			if (to_element && to_element.node) {
				mx.placement.place(_this, to_element, dir);

				// reset all directions and make them available again
				for (var dir in _this.movement)
					_this.movement[ dir ] = true;
			}
			else {
				_this.movement[ dir ] = false;
				_this._move.clear();
				mx.movement.recalculate_character_viewport(_this);

				if (!no_recalc)
					_this._move(_this, dir, true);
			}
		}
		
		// clear the move call stack
		// the move often this stack the less lag there will be
		_this._move.clear();
	}, 150);

	// short cuts to move in all directions
	for (var dir in mx.placement.direction) {
		(function () {
			 var loc_dir = dir;

			 mx.element.character.prototype[ "move_" + loc_dir ] = function () {
				 return this.move( mx.placement.direction[ loc_dir ] );
			 }
		 })();

		 dir_names[ mx.placement.direction[ dir ] ] = dir;
	}

	var recalculate_character_viewport = main.recalculate_character_viewport = function (character) {
		if (!character.view_area)
			return false;

		mx.queue.global(function () {
			var timer = new mx.debug.Timer;
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
	
				return in_row && in_column && this.type === mx.element.type.ENV;
			}, character.view_area);
	
			mx.out.character_movement_recalc(timer().toString());
			mx.storage.db[ character.holder.id ] = { "@data": character_viewport || [] };
			character.view_range_bit = true;

			for (var move in character.movement) {
				character.movement[ move ] = true;
			}
		});
	};

	return main;
})();
