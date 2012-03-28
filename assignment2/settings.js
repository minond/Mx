mx.settings.component.list = ["graph"];
mx.settings.character.list = ["alien", "bullet"];

mx.settings.movement.clicks = false;
mx.settings.movement.shortcuts = true;
mx.settings.placement.animate = true;
mx.settings.gravity.build_wall = true;

mx.settings.sound.background = "forrest.mp3";

mx.settings.dom = project.dom_settings = {
	width: document.body.offsetWidth - 150,
	height: document.body.offsetHeight - 150,
	type: mx.dom.type._2D
};

mx.element.map.car = {
	type: mx.element.node.IMG, 
	root: "cars",
	elements: {
		truck: {
			file: "truck.png",
			type: mx.element.type.PLAYER
		},
		racecar: {
			file: "racecar.png",
			type: mx.element.type.PLAYER
		}
	}
};
