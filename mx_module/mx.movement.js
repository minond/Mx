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
	mx.out.register(
		"character_movement", 
		"<div><span>[movement module] </span><span class='move'>{%id}[{%dir}], stack count: {%stack}</span></div>"
	);

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
	mx.element.character.prototype._move = manage.throttle(function (_this, dir) {
		var to_element, to_offset = x(_this.offset).copy();
		var direction = mx.placement.direction;

		/*mx.out.character_movement({ 
			id: _this.holder.id, 
			dir: dir_names[ dir ] + ":" + dir, 
			stack: _this._move.count() 
		});*/

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
			mx.sound.play.crash;
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

			to_element = mx.storage.select.element(["node", "offset"], function () {
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
				mx.sound.play.crash;
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

	return main;
})();
