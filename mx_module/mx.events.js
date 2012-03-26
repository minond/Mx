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





mx.events.shortcuts = {
	"0": 				48,
	"1": 				49,
	"2": 				50,
	"3": 				51,
	"4": 				52,
	"5": 				53,
	"6": 				54,
	"7": 				55,
	"8": 				56,
	"9": 				57,
	backspace: 			8,
	tab: 				9,
	enter: 				13,
	shift: 				16,
	ctrl: 				17,
	alt: 				18,
	pause: 				19,
	caps_lock: 			20,
	esc: 				27,
	page_up: 			33,
	page_down: 			34,
	end: 				35,
	home: 				36,
	left_arrow: 		37,
	up_arrow: 			38,
	right_arrow: 		39,
	down_arrow: 		40,
	insert: 			45,
	del: 				46,
	a: 					65,
	b: 					66,
	c: 					67,
	d: 					68,
	e: 					69,
	f: 					70,
	g: 					71,
	h: 					72,
	i: 					73,
	j: 					74,
	k: 					75,
	l: 					76,
	m: 					77,
	n: 					78,
	o: 					79,
	p: 					80,
	q: 					81,
	r: 					82,
	s: 					83,
	t: 					84,
	u: 					85,
	v: 					86,
	w: 					87,
	x: 					88,
	y: 					89,
	z: 					90,
	left_window_key: 	91,
	right_window_key: 	92,
	select: 			93,
	numpad_0: 			96,
	numpad_1: 			97,
	numpad_2: 			98,
	numpad_3: 			99,
	numpad_4: 			100,
	numpad_5: 			101,
	numpad_6: 			102,
	numpad_7: 			103,
	numpad_8: 			104,
	numpad_9: 			105,
	multiply: 			106,
	add: 				107,
	subtract: 			109,
	decimal_point: 		110,
	divide: 			111,
	f1: 				112,
	f2: 				113,
	f3: 				114,
	f4: 				115,
	f5: 				116,
	f6: 				117,
	f7: 				118,
	f8: 				119,
	f9: 				120,
	f10: 				121,
	f11: 				122,
	f12: 				123,
	num_lock: 			144,
	scroll_lock: 		145,
	semi_colon: 		186,
	equal_sign: 		187,
	comma: 				188,
	dash: 				189,
	period: 			190,
	forward_slash: 		191,
	grave_accent: 		192,
	open_bracket: 		219,
	back_slash: 		220,
	close_braket: 		221,
	single_quote: 		222
}
