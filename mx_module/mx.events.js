"use strict";


mx.include.module.dependency.dom;

mx.events = (function () {
	var main = {};

	// currently supported events:
	var events = [ 	"click", "dblclick", "change", "focus", "keydown",
					"keypress", "keyup", "mouseleave", "mouseout", "mousedown",
					"mouseover", "mouseup", "mousewheel", "resize",
					"scroll", "submit", "select" ];

	// for each event we store a flag to let us know if
	// it has already been registered to prevent multiple
	// event listeners.
	var types_registry = main.types = {};

	// we also keep a list of all events attached to each
	// event type.
	var event_registry = main.events = {};

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

	// shortcuts for all events
	for (var i = 0, max = events.length; i < max; i++) {
		types_registry[ events[i] ] = false;
		event_registry[ events[i] ] = [];

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


	// bind an action to a specific key press event
	var shortcut = main.shortcut = (function () {
		var shortcuts = {};

		bind.keydown(function (e) {
			for (var sc in shortcuts) {
				if (e.keyCode.toString() === sc)
					shortcuts[ sc ](e);
			}
		});

		return function (keycode, action) {
			if (m(keycode).is_array) {
				x(keycode).each(function () {
					shortcut(this.valueOf(), action);
				});
			}
			else if (m(keycode).is_int && m(action).is_function) {
				shortcuts[ keycode ] = action;
			}
		}
	})();

	// bind an action to a dom selector
	var click_on = main.click_on = (function () {
		var clicks = {};

		bind.click(function (e) {
			for (var ck in clicks) {
				if ("webkitMatchesSelector" in e.target && e.target.webkitMatchesSelector(ck))
					clicks[ ck ].call(e.target, e);
			}
		});

		return function (selector, action) {
			if (m(selector).is_array) {
				x(selector).each(function () {
					click_on(this.valueOf(), action);
				});
			}
			else if (m(selector).is_string && m(action).is_function) {
				clicks[ selector ] = action;
			}
		}
	})();

	return main;
})();
