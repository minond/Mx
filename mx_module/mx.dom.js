"use strict";

(function (self) {
	self.include.module.helpers;
	self.include.module.debug;
	self.include.module.enviroment.element;

	var settings = {
		classes: {
			enviromentport: "mx_enviromentport",
			viewport: "mx_viewport",
			env_row: "mx_env_row",
			env_cell: "mx_env_cell"
		},

		styles: {
			"2D": "2D.css",
			"2.5D": "2_5D.css"
		},

		css_dir: "mx_style/{%0}",

		// viewport and enviromentport initializer
		ports: true,

		// port defaults
		viewport: {
			offset: {
				top: 0,
				left: 0
			},
			dimension: {
				height: document.body.offsetHeight,
				width: document.body.offsetWidth,
			}
		},

		enviromentport: {
			display: null,
			dimension: {
				height: 100,
				width: 100
			}
		}
	};

	var main = self.module.register("dom", settings);

	// display types
	main.display = manage.const("2D", "2.5D");

	// set display default
	settings.enviromentport.display = main.display["2D"];

	// main holders
	main.holder = {
		enviromentport: null,
		viewport: null
	};

	main.ports = function () {
		var row_elem;
		var cell_elem;

		// load the style sheet
		if (settings.enviromentport.display in settings.styles) {
			self.include.register(
				stringf(
					settings.css_dir,
					settings.styles[ settings.enviromentport.display ]
				), self.include.CSS
			);
		}

		// enviromentport holds all elements
		main.holder.enviromentport = self.enviroment.element.block(
			settings.classes.enviromentport
		);

		// holds the enviroment port and acts 
		// as a view overflow block
		main.holder.viewport = self.enviroment.element.block(
			settings.classes.viewport
		);

		// append to body
		main.holder.viewport.appendChild(main.holder.enviromentport);
		document.body.appendChild(main.holder.viewport);

		// and build the enviromentport
		for (var row = 0, max_row = settings.enviromentport.dimension.height; row < max_row; row++) {
			// create a new row
			row_elem = self.enviroment.element.factory({
				type: self.enviroment.element.node_map.DIV,
				className: settings.classes.env_row
			});

			// and cells
			for (var column = 0, max_column = settings.enviromentport.dimension.width; column < max_column; column++) {
				cell_elem = self.enviroment.element.factory({
					type: self.enviroment.element.node_map.DIV,
					className: settings.classes.env_cell
				});

				// store element
				self.storage.save.enviroment_element(
					self.enviroment.element.as_enviroment_element(
						cell_elem, column, row
					)
				);

				// and display it
				row_elem.appendChild(cell_elem);
			}

			// use the throttled append
			self.stack.enviromentport_append(row_elem);
		}
	};

	self.stack.enviromentport_append = manage.throttle(function (node) {
		mx.stack.global(function () {
			main.holder.enviromentport.appendChild(node);
		});
	}, mx.stack.frame_rate);
})(mx);
