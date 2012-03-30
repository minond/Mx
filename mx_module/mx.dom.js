"use strict";


// the initialize function assument mx.element
// has been loaded as it uses mx.element.factory
// to create every cell in the viewport.
mx.include.module.dependency.element;
mx.include.module.dependency.helpers;
mx.include.module.dependency.events;
mx.include.module.dependency.debug;

// main document module
// everything that needs to access the dom should
// go through this module.
mx.dom = (function () {
	var main = { enviroment_dimensions: {} };

	var type = main.type = manage.const("_2D", "_2_5D");
	var direction = main.direction = manage.enum(37)("left", "up", "right", "down");

	var viewport = main.viewport = mx.element.block();
	var mainport = main.mainport = mx.element.block();
	var unit = "px";

	// main holder for all viewport's settings
	var vp = main.vp = {};

	// class names and ids used in the module
	// only set during initialization therefore
	// editable anytime before then.
	var ids = main.ids = {
		rclass: "env_row",
		rfirst: "first_row",
		rlast: "last_row",
		cfirst: "first_col",
		clast: "last_col",
		vpid: "mx_viewport",
		mpid: "mx_main",
		row_index: "mx_row_index",
		col_index: "mx_col_index"
	};

	// default settings
	var defaults = main.defaults = {
		node_size: 11,
		move_offset: 100,
		vp_offset: {
			top: 0,
			left: 0
		},
		styles: {
			"_2D": "mx_style/2D.css",
			"_2_5D": "mx_style/2_5D.css"
		},
		vpcell: {
			img: "empty",
			sel: "enviroment"
		}
	};

	// settings:
	var settings = main.settings = {
		// width: viewport width
		width: document.body.offsetWidth,
		// height: viewport height
		height: document.body.offsetHeight,

		// type: display type (2D, 2.5D)
		dtype: type._2D,

		// key_movement: apply arrow key viewport movement
		bind_key_actions: false,
		center: false,

		// x: enviroment element x dimension
		x: .09,
		// y: enviroment element y dimension
		y: .09,
		// padding: row padding offset
		p: 40
	};

	// the viewport is the actual holder for everything in the game
	// enviroment. enviroment elements are always added as children.
	main.initialize = vp.initialize = manage.limit(function () {
		var row_elem;
		var cell_elem;
		var env_dim = {};

		mx.settings.merge(settings, mx.settings.dom);

		if (settings.dtype in defaults.styles) {
			mx.out.dom_message("loading style: " + settings.dtype);
			mx.include.style( defaults.styles[ settings.dtype ] );
		}

		// update the view port and main port's settings
		viewport.innerHTML = "";
		viewport.id = ids.vpid;
		mainport.id = ids.mpid;
		
		// calculate the required enviroment element
		// needed to the give height, width, and dimension
		env_dim.x = settings.x * settings.width;
		env_dim.y = settings.y * settings.height;

		// build each enviroment element and added to the
		// append queue.
		for (var row = 0, max_row = Math.ceil( env_dim.y ); row < max_row; row++) {
			row_elem = mx.element.block();
			row_elem.className = ids.rclass;

			for (var column = 0, max_column = Math.ceil( env_dim.x ); column < max_column; column++) {
				cell_elem = mx.element.factory(defaults.vpcell.img, defaults.vpcell.sel, [column, row], viewport);

				// apply unique classes to the first and last columns
				if (column === 0)
					cell_elem.className += " " + ids.cfirst;
				else if (column === max_column - 1)
					cell_elem.className += " " + ids.clast;

				row_elem.appendChild(cell_elem);
				row_elem.setAttribute(ids.row_index, row.toString());
				cell_elem.setAttribute(ids.col_index, column.toString());
			}


			// apply a left padding to each row so the first
			// element line up correctly.
			if (row && settings.dtype === type._2_5D)
				x(row_elem).css({ paddingLeft: settings.p * row + unit });

			// apply unique classes to the first and last rows
			if (row === 0)
				row_elem.className += " " + ids.rfirst;
			else if (row === max_row - 1)
				row_elem.className += " " + ids.rlast;

			mx.queue.dom.append(row_elem);
		}

		main.enviroment_dimensions.rows = row - 1;
		main.enviroment_dimensions.columns = column - 1;

		mx.settings.functions(main, settings);
		mx.out.initialized("dom");
	}, 1);

	// bind the viewport's movement to the arrow keys.
	var bind_key_actions = main.bind_key_actions = function () {
		mx.events.shortcut(direction.up, function () {
			vp.move( direction.up );
		}); 

		mx.events.shortcut(direction.down, function () {
			vp.move( direction.down );
		}); 

		mx.events.shortcut(direction.left, function () {
			vp.move( direction.left );
		}); 

		mx.events.shortcut(direction.right, function () {
			vp.move( direction.right );
		});
	};

	// moves the view port in the specified direction
	vp.move = manage.throttle(function (dir) {
		vp.move.clear();

		switch (dir) {
			case direction.up:
				main.mainport.scrollTop -= defaults.move_offset;
				break;

			case direction.down:
				main.mainport.scrollTop += defaults.move_offset;
				break;

			case direction.left:
				main.mainport.scrollLeft -= defaults.move_offset;
				break;

			case direction.right:
				main.mainport.scrollLeft += defaults.move_offset;
				break;
		}
	}, 50);

	// center the viewport (for use in 2D mode only)
	main.center = function () {
		if (settings.dtype !== main.type._2D)
			return false;

		mx.queue.global(function () {
			// get the viewport's size
			var vp_height = x(mx.element.gcs(main.viewport, "height")).px2num();
			var vp_top_offset = (innerHeight - vp_height) / 2;
			var vp_left_offset = 0;

			if (mx.debugging)
				vp_left_offset = (innerWidth - 545 - (main.enviroment_dimensions.columns * main.defaults.node_size)) / 2;
			else
				vp_left_offset = (innerWidth - (main.enviroment_dimensions.columns * main.defaults.node_size)) / 2;

			// update the offset for the movement modules
			if (vp_top_offset > 0)
				main.defaults.vp_offset.top = vp_top_offset;
			if (vp_left_offset > 0)
				main.defaults.vp_offset.left = vp_left_offset;

			// and the mainport itself
			x(main.mainport).css({
				paddingTop: x(vp_top_offset).num2px(),
				paddingLeft: x(vp_left_offset).num2px()
			});
		});

		return true;
	
	};

	// view port throttled append implementation
	mx.queue.dom.append = (function () {
		var queue = function (element) {
			mx.queue.global(function () {
				main.viewport.appendChild( element );
			});
		};

		return queue;
	})();

	// main port queued append method.
	mx.queue.dom.mp_append = (function () {
		var queue = function (element) {
			mx.queue.global(function () {
				main.mainport.appendChild( element );
			});
		};

		return queue;
	})();

	// the throttled version of this function should
	// be used as the default. one when the element
	// should take first priority is this function
	// to be used.
	vp.append = function (element) {
		main.viewport.appendChild( element );
	};

	// before ending, append the viewport and the main port
	// and add both to the document body
	mainport.appendChild(viewport);
	document.body.appendChild(mainport);

	mx.out.register("dom_message", "dom module", null, "red");

	return main;
})();
