"use strict";

// the initialize function assument mx.element
// has been loaded as it uses mx.element.factory
// to create every cell in the viewport.
mx.include.module.dependency.element;
mx.include.module.dependency.helpers;

mx.dom = (function () {
	var main = {};

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
		y: 11 / 500,
		p: 40
	};

	// the viewport is the actual holder for everything in the game
	// enviroment. enviroment elements are always added as children.
	vp.initialize = manage.limit(function (cw, ch, cx, cy, cp) {
		var dim = suggested_dimensions;
		var row_elem;
		var cell_elem;

		// apply custom settings
		dim.w = cw || dim.w;
		dim.h = ch || dim.h;
		dim.x = cx || dim.x;
		dim.y = cy || dim.y;
		dim.p = cp || dim.p;

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
				cell_elem = mx.element.factory(defaults.vpcell.img, defaults.vpcell.sel);

				// apply unique classes to the first and last columns
				if (column === 0)
					cell_elem.className += " " + ids.cfirst;
				else if (column === max_column - 1)
					cell_elem.className += " " + ids.clast;

				row_elem.appendChild(cell_elem);
			}


			// apply a left padding to each row so the first
			// element line up correctly.
			if (row)
				x(row_elem).css({ paddingLeft: dim.p * row + unit });

			// apply unique classes to the first and last rows
			if (row === 0)
				row_elem.className += " " + ids.rfirst;
			else if (row === max_row - 1)
				row_elem.className += " " + ids.rlast;

			mx.queue.dom.append(row_elem);
		}
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
	var queue = manage.throttle(function (element) {
		mx.dom.viewport.appendChild( element );
	}, 1000 / 60);

	return queue;
})();
