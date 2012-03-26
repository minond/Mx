project.components = [];

project.players = ["alien"];

project.dom_settings = {
	width: 400,
	height: 250,
	type: mx.dom.type._2D
};

project.movement_settings = {
	clicks: false, 
	shortcuts: true
}

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
