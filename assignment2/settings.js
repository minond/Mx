project.components = [];

project.players = ["alien"];

project.dom_settings = {
	width: 200,
	height: 150,
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
