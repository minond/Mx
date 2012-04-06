"use strict";

(function (self) {
	// load needed modules
	self.include.module.elements.maps;

	// create and output instance for this module
	// any messages the modules needs to output should 
	// go through this function.
	self.out.register();

	// set the default settings
	var settings = {
		show_message: false,
		message_str: null
	};

	// create a new module object
	var main = mx.module.register("sample_module", settings);

	// and a sample method to demonstrate
	// the function auto calls
	main.show_message = function () {
		console.log(settings.message_str);
		return true;
	};
})(mx);

mx.settings.module.sample_module.show_message = true;
mx.settings.module.sample_module.message_str = "hello, mx!";
mx.sample_module.initialize();
