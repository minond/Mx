mx.include.module.helpers;
mx.include.module.storage;
mx.include.module.element;
mx.include.module.dom;
mx.include.module.events;
mx.include.module.component;

mx.include.component("vp_movement");
mx.include.component("pl_placement");
mx.include.component("pl_movement");
mx.include.style(mx.__project__ + "/css/players.css");
mx.include.settings;



setup = function () {
	dom.vp.initialize(600, 900);
	component.vp_movement.initialize();
	component.pl_movement.initialize();
};

main = function () {
	var truck = element.factory("racecar", "car");

	x(truck).css({
		'position': 'absolute',
		'top': '78px',
		'left': '302px'
	});
	
	queue.dom.vp_append(truck);
};
