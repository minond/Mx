"use strict";


mx.include.module.dependency.dom;

mx.events = (function () {
	var main = {};

	// currently supported events:
	var events = [ 	"click", "dblclick", "change", "focus", "keydown",
					"keypress", "keyup", "mouseleave", "mouseout",
					"mouseover", "mouseup", "mousewheel", "resize",
					"scroll", "submit", "select" ];

	// for each event we store a flag to let us know if
	// it has already been registered to prevent multiple
	// event listeners.
	var types_registry = main.types = {};

	// we also keep a list of all events attached to each
	// event type.
	var event_registry = main.events = {};

	for (var i = 0, max = events.length; i < max; i++) {
		types_registry[ events[i] ] = false;
		event_registry[ events[i] ] = [];
	}

	// api for adding methods
	var bind = main.bind = function (type, action) {
		// set the event listener if necessary
		if (!types_registry[ type ])
			bind_event(type);

		// mark the event type as a registered event
		types_registry[ type ] = true;

		// and add the new event to the list of actions
		event_registry[ type ].push(action);
	};

	// bind an action to a specific key press event
	var shortcut = main.shortcut = function (keycode, action) {
		if (m(keycode).is_array) {
			x(keycode).each(function (key) {
				shortcut(this.valueOf(), action);
			});
		}

		else if (m(keycode).is_int) {
			(function () {
				var loc_code = keycode;
				var loc_action = action;

				bind.keydown(function (e) {
					if (e.keyCode === loc_code) {
						loc_action(e);
					}
				});
			})();
		}
	};

	// shorcuts for all events
	for (var i = 0, max = events.length; i < max; i++) {
		(function () {
			var _type = events[i];
			main.bind[ _type ] = function (action) {
				main.bind(_type, action);
			};
		})();
	}


	// manages binding event listeners to the mx main port
	var bind_event = function (type) {
		if (type in event_registry) {
			document.body.addEventListener(type, function (e) {
				var _event = e;
				var _elem = this;
				if (event_registry[ type ].length)
					x(event_registry[ type ]).each(function () {
						this.call(_elem, _event);
					});
			}, false);
		}
	};

	return main;
})();
