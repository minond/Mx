"use strict";


mx.include.module.dependency.events;

(function () {
	var main = { name: "vp_movement", offset: 100 };

	var direction = manage.enum("up", "down", "left", "right");
	var kbrkey = {up: [38, 87], down: [40, 83], left: [37, 65], right: [39, 68] };

	var bind_key_actions = function () {
		mx.events.shortcut(kbrkey.up, function () {
			main.action( direction.up );
		});

		mx.events.shortcut(kbrkey.down, function () {
			main.action( direction.down );
		});

		mx.events.shortcut(kbrkey.left, function () {
			main.action( direction.left );
		});

		mx.events.shortcut(kbrkey.right, function () {
			main.action( direction.right );
		});
	};


	main.action = manage.throttle(function (dir) {
		main.action.clear();
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
		bind_key_actions();
	}, 1);


	mx.components.register(main);
})();
