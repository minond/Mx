"use strict";


mx.include.module.dependency.gravity;
mx.include.module.dependency.player;
mx.include.module.dependency.element;
mx.include.module.dependency.storage;
mx.include.module.dependency.helpers;

mx.placement = (function () {
	var main = {};
	var sample_node, node_dimensions;

	var directions = ["up", "down", "left", "right"];
	var direction = main.direction = manage.enum.apply(manage, directions);

	main.initialize = function () {
		// calculate the dimensions of the 
		// enviroment elements
		sample_node = mx.storage.select.element(["node"], function () {
			return this.type === mx.element.type.ENV;
		}, true, true)[0];

		node_dimensions = {
			width: x(mx.element.gcs(sample_node, "width")).px2num(),
			height: x(mx.element.gcs(sample_node, "height")).px2num()
		};
	};

	// puts an element in an enviroment node
	var put = function (elem, offset) {
		var node = mx.element.get_node(elem);
		main.initialize();

		x(node).css({
			top: x(node_dimensions.height * offset[1] + offset[1]).num2px(),
			left: x(node_dimensions.width * offset[0] + offset[0]).num2px()
		});

		if (m(elem).is_player) {
			elem.offset = offset;
		}
	};

	// place an element in the viewport
	var place = main.place = function (elem, proposed_holder_info) {
		mx.queue.global(function () {
			var elem_info = get_size(elem);
			var end_x, end_y, end_holder;

			if (!proposed_holder_info) {
				proposed_holder_info = mx.storage.select.element(mSQL.QUERY.all, function () {
					return this.type === mx.element.type.ENV && !this.node.mx_gravity; 
				}, 1, true, true)[0];
			}

			if (elem_info.player && proposed_holder_info.node) {
				// using the player's dimensions, it is placed in the viewport
				// wherever there is enough enviroment nodes to hold it.
				end_x = elem_info.width + proposed_holder_info.offset[0];
				end_y = elem_info.height + proposed_holder_info.offset[1];

				// zero index
				--end_x;
				--end_y;

				end_holder = mx.storage.select.element(mSQL.QUERY.all, function () {
					return x(this.offset).eq([end_x, end_y]);
				}, 1, true, true)[0];

				// a holder was found
				if (end_holder && end_holder.node) {
					elem._holder = end_holder.node;
					put(elem, [proposed_holder_info.offset[0], proposed_holder_info.offset[1]]);
				}
			}
		});
	};

	// calculates the size of a given element so that
	// possible placement can be allowed or rejected.
	var get_size = function (elem) {
		var node = mx.element.get_node(elem), dimensions = {};

		if (elem instanceof mx.element.player) {
			dimensions.width = elem.raw_width;
			dimensions.height = elem.raw_height;
			dimensions.player = true;
		}
		else {
			dimensions.width = x(mx.element.gcs(node, "width")).px2num();
			dimensions.height = x(mx.element.gcs(node, "height")).px2num();
			dimensions.player = false;
		}

		return dimensions;
	};

	// updates to player element
	mx.element.player.prototype._move = manage.throttle(function (_this, dir) {
		_this._move.clear();

		var to_element, to_offset = x(_this.offset).copy();

		// create this new direction
		if (!(dir in _this.can_move))
			_this.can_move[ dir ] = true;

		// check if we have tried moving here in the previous move
		if (!_this.can_move[ dir ])
			return false;

		if (dir) {
			switch (dir) {
				case direction.up:
					to_offset[1]--;
					break;
				case direction.down:
					to_offset[1]++;
					break;
				case direction.left:
					to_offset[0]--;
					break;
				case direction.right:
					to_offset[0]++;
					break;
			}

			to_element = mx.storage.select.element(mSQL.QUERY.all, function () {
				return x(this.offset).eq(to_offset);
			}, 1)[0];

			if (to_element && to_element.node) {
				main.place(_this, to_element);

				// reset all directions and make them available again
				for (var dir in _this.can_move) {
					_this.can_move[ dir ] = true;
				}
			}
			else
				_this.can_move[ dir ] = false;

			_this._move.clear();
		}
	}, 75);

	// movent cache
	mx.element.player.prototype.can_move = {};

	// move a player
	mx.element.player.prototype.move = function (dir) {
		this._move(this, dir);
	};

	// stop a player
	mx.element.player.prototype.stop = function () {
		this._move.clear();
	};

	// short cuts to move in all directions
	for (var dir in direction) {
		(function () {
			var _dir_ = dir;
			mx.element.player.prototype[ "move_" + _dir_ ] = function () {
				return this.move( direction[ _dir_ ] );
			}
		})();
	}

	return main;
})();
