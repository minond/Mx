project.components = ["graph"];

project.characters = ["alien", "bullet"];

project.dom_settings = {
	width: 600,
	height: 300,
	type: mx.dom.type._2D
};

project.movement_settings = {
	clicks: false, 
	shortcuts: true
};

project.placement_settings = {
	animate: true
};

project.gravity_settings = {
	build_wall: true
};

project.sound_settings = {
	background: "forrest.mp3"
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
