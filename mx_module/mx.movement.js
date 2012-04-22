"use strict";

(function (self) {
	self.include.module.events;
	self.include.module.enviroment.placement

	var settings = {
		// bind keyboard arrow keys to character movement
		keyboard_listener: true
	};

	var main = self.module.register("movement", settings, self.enviroment);

	// constant directions
	main.direction = manage.enum("up", "down", "left", "right");

	// holds current main character
	var current_selection;

	main.select = function (elem) {
		current_selection = null;

		if (mtype(elem).is_character) {
			current_selection = elem;
		}
	};

	main.keyboard_listener = manage.limit(function () {
		var keys = [
			self.events.shortcuts.up_arrow,
			self.events.shortcuts.right_arrow,
			self.events.shortcuts.down_arrow,
			self.events.shortcuts.left_arrow
		];

		self.events.shortcut(keys, function (ev) {
			var new_offset = [];
			new_offset[0] = current_selection ? current_selection.offset[0] : null;
			new_offset[1] = current_selection ? current_selection.offset[1] : null;

			if (!current_selection || !new_offset) {
				return false;
			}

			switch (ev.keyCode) {
				case self.events.shortcuts.up_arrow:
					new_offset[1]--;
					break;

				case self.events.shortcuts.right_arrow:
					new_offset[0]++;
					break;

				case self.events.shortcuts.down_arrow:
					new_offset[1]++;
					break;

				case self.events.shortcuts.left_arrow:
					new_offset[0]--;
					break;

				default:
					return false;
			}

			self.enviroment.placement.place(current_selection, new_offset);
		});
	}, 1);
})(mx);
