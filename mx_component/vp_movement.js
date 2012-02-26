"use strict";


mx.include.component.dependency("event");

(function () {
	var main = { name: "vp_movement", offset: 150 };

	var direction = manage.enum("up", "down", "left", "right");
	var kbrkey = {up: 38, down: 40, left: 37, right: 39 };

	var key_action = function () {
		mx.component.event.bind.keydown(function (e) {
			switch (e.keyCode) {
				case kbrkey.up:
					main.action.clear();
					main.action( direction.up );
					break;

				case kbrkey.down:
					main.action.clear();
					main.action( direction.down );
					break;

				case kbrkey.left:
					main.action.clear();
					main.action( direction.left );
					break;

				case kbrkey.right:
					main.action.clear();
					main.action( direction.right );
					break;
			}
		});
	};


	main.action = manage.throttle(function (dir) {
		switch (dir) {
			case direction.up:
				mx.dom.mainport.scrollTop -= main.offset;
				break;

			case direction.down:
				mx.dom.mainport.scrollTop += main.offset;
				break;

			case direction.left:
				mx.dom.mainport.scrollLeft -= main.offset;
				break;

			case direction.right:
				mx.dom.mainport.scrollLeft += main.offset;
				break;
		}
	}, 50);

	main.initialize = manage.limit(function () {
		key_action();
	}, 1);


	mx.components.register(main);
})();
