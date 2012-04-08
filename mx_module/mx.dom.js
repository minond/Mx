"use strict";

(function (self) {
	self.include.module.helpers;
	self.include.module.events;
	self.include.module.debug;
	self.include.module.enviroment.element;

	var settings = {
		classes: {
			enviromentport: "mx_enviromentport",
			viewport: "mx_viewport"
		},

		// viewport and enviromentport initializer
		ports: true,
		viewport: {
			display: null,
			offset: {
				top: 0,
				left: 0
			},
			dimension: {
				height: document.body.offsetHeight,
				width: document.body.offsetWidth,
			}
		}
	};

	var main = self.module.register("dom", settings, self.enviroment);

	// display types
	main.display = manage.enum("_2D", "_2_5D");

	// set display default
	settings.viewport.display = main.display._2D;

	// main holders
	main.holder = {
		enviromentport: null,
		viewport: null
	};

	main.ports = function () {
		// enviromentport holds all elements
		main.holder.enviromentport = self.enviroment.element.block(
			settings.classes.enviromentport
		);

		// holds the enviroment port and acts 
		// as a view overflow block
		main.holder.viewport = self.enviroment.element.block(
			settings.classes.viewport
		);
	};

	self.stack.enviromentport_append = function (node) {};
})(mx);
