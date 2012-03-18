"use strict";


mx.sound = (function () {
	var main = { play: {}, pause: {} };
	var dir = "mx_sounds/";
	var sounds = {};

	// load and ready a new sound
	main.register = function (file) {
		var src = dir + file;
		var name = file.split(".")[0];

		mx.out.resource({ name: file, type: "sound" });

		(function () {
			var loc_src = src;
			var loc_name = name;

			sounds[ loc_name ] = new Audio(loc_src);

			main.play.__defineGetter__(loc_name, function () {
				sounds[ loc_name ].play();
			});

			main.pause.__defineGetter__(loc_name, function () {
				sounds[ loc_name ].pause();
			});
		})();
	};

	return main;
})();
