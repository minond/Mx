"use strict";


mx.include.module.dependency.dom;
mx.include.module.dependency.events;
mx.include.module.dependency.element;

(function () {
	var main = { name: "pl_movement" };
	var player_selector = "img[mx_type='player']";

	var handle_selection = function (node) {
		node.style.border = "1px solid black";
	};


	main.initialize = manage.limit(function () {
		mx.events.click_on(player_selector, function () {
			handle_selection(this);
		});
	}, 1);

	mx.components.register(main);
})();
