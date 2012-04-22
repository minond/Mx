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

		// node size checker
		node_dimensions: true,

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
				height: 20,
				width: 90
			},
			node_size: {
				height: null,
				width: null
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

	// checks an enviroment element for dimensions
	main.node_dimensions = function (run, node) {
		var sample = node ? { node: node } : self.storage.get.enviroment_element([0, 0]);
		var total_height = 0, total_width = 0;

		var height = [
			// regular sizes
			"height",

			// border sizes
			"border-top-width",
			"border-bottom-width",

			// padding
			"padding-top",
			"padding-bottom",

			// margin
			"margin-top",
			"margin-bottom",
		];

		var width = [
			// regular sizes
			"width",

			// border sizes
			"border-right-width",
			"border-left-width",

			// padding
			"padding-right",
			"padding-left",

			// margin
			"margin-right",
			"margin-left"
		];

		if (!sample) {
			main.node_dimensions.run_after = true;
		}
		else {
			height = mh.map(height, function (i, prop) {
				return mh.px2num(self.enviroment.element.gcs(sample.node, prop)) || 0;
			});

			width = mh.map(width, function (i, prop) {
				return mh.px2num(self.enviroment.element.gcs(sample.node, prop)) || 0;
			});

			mh.for_each(height, function (i, size) {
				total_height += size;
			});

			mh.for_each(width, function (i, size) {
				total_width += size;
			});

			if (!node) {
				settings.enviromentport.node_size.width = total_width;
				settings.enviromentport.node_size.height = total_height;
			}
			else {
				return {
					height: total_height,
					width: total_width
				};
			}
		}
	};

	main.node_dimensions.run_after = false;

	// initializes the enviroment and view ports
	main.ports = manage.limit(function () {
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

		// check for node checker request
		if (main.node_dimensions.run_after) {
			main.node_dimensions();
		}
	}, 1);

	// throttled append
	self.stack.enviromentport_append = function (node) {
		self.stack.global(function () {
			main.append(node);
		});
	}

	// regular append
	main.append = function (node) {
		main.holder.enviromentport.appendChild(node);
	};
})(mx);
