"use strict";

(function (self) {
	self.include.module.dom;
	self.include.module.storage;
	self.include.module.character;
	self.include.module.enviroment.element;

	var settings = {};
	var main = self.module.register("placement", settings, mx.enviroment);

	// helper function. takes an array of node arrays
	// and returns an array of nodes
	var flatten_node_array = function (list) {
		var ret = [];

		mh.for_each(list, function (i, val) {
			mh.for_each(val, function (i, node) {
				ret.push(node);
			});
		});

		return ret;
	};

	// helper function. mark/tag element as used
	// helper function. mark/tag element as unused
	var mark_used = function (offset, used) {
		var node = self.storage.get.enviroment_element(offset);

		if (!node) {
			return false;
		}

		node.used = used;

		if (self.debug.settings.debugging) {
			mh.css(node.node, {
				backgroundColor: used ? 
					self.enviroment.element.color_map.yellow : 
					self.enviroment.element.color_map.white
			});
		}
	};

	// make all characters hold their locaion elements
	self.Character.prototype.surrounding_elements = [];

	main.place = manage.throttle(function (elem, on, valid_callback) {
		var holder, height, width, valid_location = true;
		var on_node = self.storage.get.enviroment_element(on);
		var n_array = [on], h_array, w_array;

		if (!mtype(elem).is_character || !mtype(on).is_array || !on_node) {
			return false;
		}

		main.place.clear();

		height = elem.height;
		width = elem.width;

		// now find all nodes around the element
		var h_array = mh.times(height - 1, function (i) {
			return [
				[on[0], on[1] + i + 1],
				[on[0] + width - 1, on[1] + i + 1]
			];
		});

		var w_array = mh.times(width - 1, function (i) {
			return [
				[on[0] + i + 1, on[1]],
				[on[0] + i + 1, on[1] + height - 1]
			];
		});

		// combine into one list
		n_array = n_array.concat(flatten_node_array(h_array));
		n_array = n_array.concat(flatten_node_array(w_array));

		// n_array now holds a list of the elements surrounding nodes
		// now check all of those nodes and make sure
		// this element can be placed in the requested
		// location
		mh.for_each(n_array, function (i, offset) {
			var loc = self.storage.get.enviroment_element(offset);

			if (!loc) {
				valid_location = false;
			}
			else if (loc.type !== mx.enviroment.element.type_map.ENVIROMENT) {
				valid_location = false;
			}
		});

		// if valid, mode the element
		if (valid_location) {
			if (!valid_callback) {
				// storage location data
				// clean old information if any
				if (elem.surrounding_elements && mtype(elem.surrounding_elements).is_array) {
					mh.for_each(elem.surrounding_elements, function (i, offset) {
						mark_used(offset, false);
					});
				};

				// and use up the new data
				elem.offset = on;
				elem.surrounding_elements = n_array.concat(on);
				mh.for_each(elem.surrounding_elements, function (i, offset) {
					mark_used(offset, true);
				});

				holder = self.Character.get_holder(elem);

				mh.css(holder, {
					top: on[1] * self.dom.settings.enviromentport.node_size.height,
					left: on[0] * self.dom.settings.enviromentport.node_size.width
				});
			}
			else {
				valid_callback(elem, on);
			}
		}

		return valid_location;
	}, 50);
})(mx);
