"use strict";


mx.queue = new function () {
	this.stack = throttle(function (fn) { fn(); }, 1000 / 60);

	return Mx.queue;
};


mx.queue.component = function (cname, args) {
	this.stack(function () {
		Mx.comp[ cname ].init.apply(window, args || []);
	});

	return Mx.queue;
};


mx.queue.component._call = function (cname, fnname, args) {
	Mx.queue.stack(function () {
		Mx.comp[ cname ][ fnname ].apply(window, args || []);
	});

	return Mx.queue;
};


mx.queue.dom = function (node) {
	this.stack(function () {
		Mx.dom.append(node);
	});

	return Mx.queue;
};


mx.queue.out = function (str, action) {
	this.stack(function () {
		if (m(action).is_function) {
			switch (action.length) {
				case 1:
					Alert.confirm(str, action);
					break;

				case 2:
					Alert.prompt(str, "", action);
					break;

				default:
					Alert.alert(str, action);
					break;
			}
		}

		else if (m(action).is_number)
			Alert.message(str, action);
		else
			Alert.alert(str);
	});

	return Mx.queue;
};
