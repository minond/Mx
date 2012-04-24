"use strict";

(function (self) {
	self.include.module.out;

	// everytime a sound file is registered
	// a message it sent out
	self.out.register("sound", {
		title: "Sound File"
	});

	var settings = {
		directory: "mx_sounds/",
		background_music: false
	};

	var main = self.module.register("sound", settings);

	// takes a sound file name and loades the 
	// resources, saves it as a sound objects, 
	// and makes it available through the module methods
	main.register = function (filename) {
		var src = settings.directory + filename;
		var name = filename.split(".")[0];

		main[ name ] = new Audio(src);

		return name;
	};

	// registers a sound and starts playing it
	// right away
	main.background_music = function (filename) {
		var name = main.register(filename);

		main[ name ].play();
		main[ name ].loop = true;
		main[ name ].volume = .2;

		return main[ name ];
	};
})(mx);
