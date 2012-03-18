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

	var viewport = main.viewport = document.createElement("div");
	var mainport = main.mainport = document.createElement("div");
	var unit = "px";

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
		mpid: "mx_main"
	};

	// default settings
	var defaults = main.defaults = {
		move_offset: 100,
		styles: {
			"_2D": "mx_style/2D.css",
			"_2_5D": "mx_style/2_5D.css"
		},
		vpcell: {
			img: "empty",
			sel: "enviroment"
		}
	};

	// main holder for all viewport's settings
	var vp = main.vp = {};

	// suggested dimensions for the view port. 
	// custom dimensions will overwrite this setting.
	var suggested_dimensions = {
		h: innerHeight - 80,
		w: innerWidth - 50,
		x: 8 / 100,
		y: 8 / 100,
		p: 40
	};

	// bind the viewport's movement to the arrow keys.
	var bind_key_actions = function () {
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
				mx.dom.mainport.scrollTop -= defaults.move_offset;
				break;

			case direction.down:
				mx.dom.mainport.scrollTop += defaults.move_offset;
				break;

			case direction.left:
				mx.dom.mainport.scrollLeft -= defaults.move_offset;
				break;

			case direction.right:
				mx.dom.mainport.scrollLeft += defaults.move_offset;
				break;
		}
	}, 50);


	// the viewport is the actual holder for everything in the game
	// enviroment. enviroment elements are always added as children.
	// settings:
	// width: viewport width
	// height: viewport height
	// x: enviroment element x dimension
	// y: enviroment element y dimension
	// padding: row padding offset
	// type: display type (2D, 2.5D)
	// key_movement: apply arrow key viewport movement
	vp.initialize = manage.limit(function (settings) {
		var dim = suggested_dimensions;
		var dtype = settings.type || type._2_5D;
		var row_elem;
		var cell_elem;

		if ("key_movement" in settings && settings.key_movement) {
			mx.debug.log("applying arrow key viewport movement");
			bind_key_actions();
		}

		if (dtype in defaults.styles) {
			mx.debug.log("loading style:", dtype);
			mx.include.style( defaults.styles[ dtype ] );
		}

		// apply custom settings
		dim.w = settings.width || dim.w;
		dim.h = settings.height || dim.h;
		dim.x = settings.x || dim.x;
		dim.y = settings.y || dim.y;
		dim.p = settings.padding || dim.p;

		// update the view port and main port's settings
		viewport.innerHTML = "";
		viewport.id = ids.vpid;
		mainport.id = ids.mpid;
		

		// calculate the required enviroment element
		// needed to the give height, width, and dimension
		var env_dim = {
			x: dim.x * dim.w,
			y: dim.y * dim.h
		};

		// build each enviroment element and added to the
		// append queue.
		for (var row = 0, max_row = Math.ceil( env_dim.y ); row < max_row; row++) {
			row_elem = document.createElement("div");
			row_elem.className = ids.rclass;

			for (var column = 0, max_column = Math.ceil( env_dim.x ); column < max_column; column++) {
				cell_elem = mx.element.factory(defaults.vpcell.img, defaults.vpcell.sel, [column, row], viewport);

				// apply unique classes to the first and last columns
				if (column === 0)
					cell_elem.className += " " + ids.cfirst;
				else if (column === max_column - 1)
					cell_elem.className += " " + ids.clast;

				row_elem.appendChild(cell_elem);
			}


			// apply a left padding to each row so the first
			// element line up correctly.
			if (row && dtype === type._2_5D)
				x(row_elem).css({ paddingLeft: dim.p * row + unit });

			// apply unique classes to the first and last rows
			if (row === 0)
				row_elem.className += " " + ids.rfirst;
			else if (row === max_row - 1)
				row_elem.className += " " + ids.rlast;

			mx.queue.dom.append(row_elem);
		}

		main.enviroment_dimensions = { rows: row - 1, columns: column - 1 };
	}, 1000);


	// the throttled version of this function should
	// be used as the default. one when the element
	// should take first priority is this function
	// to be used.
	vp.append = function (element) {
		mx.dom.viewport.appendChild( element );
	};


	// before ending, append the viewport and the main port
	// and add both to the document body
	mainport.appendChild(viewport);
	document.body.appendChild(mainport);

	return main;
})();


// view port throttled append implementation
mx.queue.dom.append = (function () {
	var queue = function (element) {
		mx.queue.global(function () {
			mx.dom.viewport.appendChild( element );
		});
	};

	return queue;
})();

// main port queued append method.
mx.queue.dom.mp_append = (function () {
	var queue = function (element) {
		mx.queue.global(function () {
			mx.dom.mainport.appendChild( element );
		});
	};

	return queue;
})();
