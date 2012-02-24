(function () {
	var main = { name: "places", onaftermove: function () {} };
	var last_clicked;
	var ran = false;

	main.init = function () {};

	main.listen = function (listen) {
		if (ran) {
			return false;
		}

		if (listen === Mx.const.event.KEYDOWN) {
			$(document).keydown(function (e) {
				switch (e.keyCode) {
					// i right
					case 73:
					case 39:
						Mx.comp.places.move.clear();
						Mx.comp.places.move(Mx.get.pl1, Mx.const.move.right);
						break;

					// j left
					case 74:
					case 37:
						Mx.comp.places.move.clear();
						Mx.comp.places.move(Mx.get.pl1, Mx.const.move.left);
						break;

					// k down
					case 75:
					case 40:
						Mx.comp.places.move.clear();
						Mx.comp.places.move(Mx.get.pl1, Mx.const.move.down);
						break;

					// u up
					case 85:
					case 38:
						Mx.comp.places.move.clear();
						Mx.comp.places.move(Mx.get.pl1, Mx.const.move.up);
						break;
				}
			});
		}

		else if (listen === Mx.const.event.CLICK) {
			Mx.bind(Mx.const.event.CLICK, Mx.dom.holder, function (e) {
				var target = get_node(e.target);

				// do we need to move?
				if (target.type === Mx.const.dom.type.BUILDING) {
					last_clicked = target;
					return false;
				}

				// yes we do
				else if (last_clicked) {
					move(target);
				}
			});
		}
	};


	main.center = function (elem) {
		last_clicked = { node: elem };
		move( find_center_node() );
	};

	main.random = function (elem) {
		last_clicked = { node: elem };
		move( get_random_node() );
	};

	main.move = manage.throttle(function (elem, dir) {
		var m;

		if (!elem || !dir) {
			return false;
		}

		m = find_possible_moves(elem);
		last_clicked = { node: elem };

		switch (dir) {
			case Mx.const.move.up:
				m.u && move( m.u );
				break;

			case Mx.const.move.down:
				m.k && move( m.k );
				break;

			case Mx.const.move.left:
				m.j && move( m.j );
				break;

			case Mx.const.move.right:
				m.i && move( m.i );
				break;
		}
	}, 100);



	var move = function (end_target) {
		if (!end_target || !end_target.node) {
			return false;
		}

		var dims = Mx.dom.pl_dim;
		var mstart = { X: 8, Y: -53 };
		var widths = { X: 42, Y: 13 };
		var mstop = { X: mstart.X, Y: mstart.Y };

		for (var i = 0; i < end_target.offset[0]; i++) {
			mstop.X += widths.X;
		}

		// then y axis movement
		for (var i = 0; i < end_target.offset[1]; i++) {
			mstop.Y += widths.Y;
		}

		// update target
		last_clicked.node.father = end_target;

		// and move it
		x( last_clicked.node ).style({
			"top": mstop.Y,
			"left": mstop.X
		});

		Mx.debug.logf("moving element to [ x: {%X:?}, y: {%Y:?} ]", mstop);
		main.onaftermove(last_clicked, end_target, mstart, mstop, widths, dims);
	};


	var get_node = function (node) {
		return Mx.storage.select("*", Mx.internals.id.storage.IMAGES, function () {
			return this.node === node;
		}, 1)[0];
	};

	var get_node_by_offset = function (x, y) {
		return Mx.storage.select(mSQL.QUERY.all, Mx.internals.id.storage.IMAGES, function () {
			return m(this.offset).is_array && this.offset[0] === x  && this.offset[1] === y;
		}, 1)[0];
	};


	var find_center_node = function () {
		var x = Math.ceil( (Mx.dom.pl_dim.X - 1) / 2 );
		var y = Math.ceil( (Mx.dom.pl_dim.Y - 1) / 2 );

		return get_node_by_offset(x, y);
	};

	var get_random_node = function () {
		var x = Math.floor( Math.random() * Mx.dom.pl_dim.X - 1 );
		var y = Math.floor( Math.random() * Mx.dom.pl_dim.Y - 1 );

		return get_node_by_offset(x, y);
	};


	var find_possible_moves = function (elem) {
		var ofs = elem.father.offset;

		return moves = {
			j: (get_node_by_offset( ofs[0] - 1, ofs[1] )    || 0), // left
			u: (get_node_by_offset( ofs[0] - 1, ofs[1] - 1) || 0), // up
			i: (get_node_by_offset( ofs[0] + 1, ofs[1] )    || 0), // right
			k: (get_node_by_offset( ofs[0] + 1, ofs[1] + 1) || 0)  // down
		}
	};



	Mx.component.register(main);
})();
