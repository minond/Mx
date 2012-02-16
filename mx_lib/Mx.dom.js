"use strict";


Mx.dom = (function () {
	var main = { vp: {} };
	var min_throttle_ms = 6;

	var unit = "px";
	var speed = "fast";
	var elemtype = "div";
	var storageprop = "@data";
	var imgsection = "enviroment";
	var imgtype = "empty";

	var holder = main.holder = document.createElement( elemtype );
	var viewport = main.viewport = document.createElement( elemtype );
	var root = main.root = document.body;
	var $holder = $(holder);

	var init_project = main.init = function () {
		holder.id = Mx.internals.id.dom.master;
		viewport.id = Mx.internals.id.dom.viewport;
		root.appendChild(viewport);
		viewport.appendChild(holder);
	};

	var append = main.append = function (node) {
		holder.appendChild(node);
		return holder;
	};


	var viewport_center = main.vp.init = function () {
		Mx.bind.register(Mx.internals.id.dom.events.win_resize, Mx.const.event.RESIZE, window, (function () {
			$holder.stop(true).animate({
				top: (window.innerHeight - $holder.height()) / 2 + unit,
				left: (window.innerWidth - $holder.width()) / 2 + unit
			}, speed);
		}));
	};

	var VIEWPORT_CREATED = false;
	var create_viewport = main.vp.create = function (width, height) {
		if (VIEWPORT_CREATED)
			return false;

		VIEWPORT_CREATED = true;

		holder.style.width = width + unit;
		holder.style.height = height + unit;
		
		var vp_dim = { X: 0.0225, Y: 0.0769 };
		var vp_dim = { Y: 25 / 311, X: 23 / 1000 };
		var vp_dim = { Y: 8 / 100, X: 11 / 500 };

		var pl_dim = {
			X: vp_dim.X * width,
			Y: vp_dim.Y * height
		};

		var rowholder;

		for (var row = 0, max_row = Math.ceil(pl_dim.Y); row < max_row; row++) {
			rowholder = document.createElement( elemtype );

			for (var col = 0, max_col = Math.ceil(pl_dim.X); col < max_col; col++)
				rowholder.appendChild( Mx.image.factory(imgtype, imgsection, [col, row]) );

			Mx.queue.dom( rowholder );
		}

		Mx.debug.log(pl_dim);
		Mx.bind.trigger( Mx.internals.id.dom.events.win_resize );

		return pl_dim;
	};

	var reset_viewport = main.vp.reset = function () {
		if (!VIEWPORT_CREATED)
			return false;
			
		for (var i = Mx.storage.db.images[ storageprop ].length - 1; i >= 0; i--) {
			x(Mx.storage.db.images[ storageprop ][i].node).remove();
			delete Mx.storage.db.images[ storageprop ][i].node;
			Mx.storage.db.images[ storageprop ].pop();
		}

		VIEWPORT_CREATED = false;

		return create_viewport;
	};

	return main;
})();


