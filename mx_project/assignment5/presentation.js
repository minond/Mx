// Game design ===============================================================

// "Mario Bros" type 2D games
// Movement and gravity
// Mutiplayer
// Goals, points, obstacles




// Software design ===========================================================

// create a module:
(function (self) {
	var settings = {
		increment: 10
	};

	var main = self.module.register("sample_module", settings);

	main.special_function = function (a, b) {
		return a + b + settings.increment;
	};
})(mx);	

// load a module
mx.include.module.sample_module;

// use a module
var my_num = mx.sample_module(3, 54);


// Hash table of every block/node in the game
var node1 = mx.storage.get.enviroment_element([12, 54]);




// Future design =============================================================

// improve multiplayer experience
// enhance player movement
