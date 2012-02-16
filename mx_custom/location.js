"use strict";

(function () {
	var main = { name: "location", action: null },
		path = main.path = { from: null, to: null },

		// class and class selectors for this component
		cname = "location_component_selected",
		csel  = "." + cname,

		// table storing the elements we're working with and the column (properties)
		// we need to get back.
		ptable = "images",
		pret   = ["node"];


	var out = {
		fromto: "you are moving from {%0}@{%1} to {%2}@{%3}",
		connect: "this is the connector: [{%0}], and you're moving [{%1}]" 
	};

	var dirs = manage.const("up", "down", "left", "right", "straight");
	var dir_action = [];


	// loops through the return value from Mx.storage.select and
	// sets the node's class to the component's selection class.
	var rec_c_update = function (elems) {
		for (var i = 0, m = elems.length; i < m; i++)
			if ("node" in elems[ i ])
				elems[ i ].node.className = cname;
			else
				elems[ i ].className = cname;
	};

	rec_c_update = throttle(rec_c_update, 250);

	// checks source and targe elements to figure out
	// which direction we're moving.
	// up, down, left, right, etc.
	var calc_direction = function (points, map) {
		// x axis
		if (points.from.offset[0] < points.to.offset[0])
			map[0] = dirs.RIGHT;
		else if (points.from.offset[0] > points.to.offset[0])
			map[0] = dirs.LEFT;
		else
			map[0] = dirs.STRAIGHT;

		// y axis
		if (points.from.offset[1] < points.to.offset[1])
			map[1] = dirs.DOWN;
		else if (points.from.offset[1] > points.to.offset[1])
			map[1] = dirs.UP;
		else
			map[1] = dirs.STRAIGHT;
	}


	main.action = function (ev) {
		var connector = [];
		var elem = Mx.storage.select("*", ptable, function () { 
			return this.node === ev.target 
		}, 1)[0];

		// this is the starting location
		if (!path.from) {
			path.from = elem; 
			$(csel).removeClass(cname);
			return true;
		}

		// this is the destination
		path.to = elem;
		rec_c_update([path.from.node, path.to.node]);

		// find out which direction we're moving
		calc_direction(path, dir_action);

		// add up the location for the connector node
		for (var i = 0; i < dir_action.length; i++) {
			switch (dir_action[i]) {
				case dirs.UP:
				case dirs.DOWN:
					connector[1] = path.to.offset[1];
					break;

				case dirs.LEFT:
					connector[0] = path.from.offset[0] - (path.from.offset[1] - path.to.offset[1]);
					break;

				case dirs.RIGHT:
					connector[0] = path.from.offset[0] + (path.to.offset[1] - path.from.offset[1]);
					break;
			}
		}

		// update the connector node
		rec_c_update(Mx.storage.select(pret, ptable, function () { 
			return this.offset[0] === connector[0] && this.offset[1] === connector[1];
		}, 1));

		// y axis
		if (dir_action[0] === dirs.RIGHT && dir_action[1] === dirs.DOWN) {
			for (var i = path.from.offset[0], j = 1; i < connector[0]; i++, j++)
				rec_c_update(Mx.storage.select(pret, ptable, function () { 
					return this.offset[0] === i + 1 && this.offset[1] === path.from.offset[1] + j 
				}, 1));
		}

		// else if (dir_action[0] === 

		// x axis
		if (dir_action[0] === dirs.RIGHT) {
			for (var i = connector[0]; i < path.to.offset[0]; i++)
				rec_c_update(Mx.storage.select(pret, ptable, function () {
					return this.offset[0] === i && this.offset[1] === connector[1]; 
				}, 1));
		}

		else if (dir_action[0] === dirs.LEFT) {
			for (var i = connector[0]; i > path.to.offset[0]; i--)
				rec_c_update(Mx.storage.select(pret, ptable, function () {
					return this.offset[0] === i && this.offset[1] === connector[1]; 
				}, 1));
		}


		Mx.debug.logf(out.fromto, path.from.id, path.from.offset, path.to.id, path.to.offset);
		Mx.debug.logf(out.connect, connector.toString(), dir_action.toString());

		// Clean up clean up everybody everywhere.
		// Clean up clean up everybody do your share.
		return delete path.to && delete path.from;
	};


	main.init = limit(function () {
		Mx.bind(Mx.const.event.CLICK, Mx.dom.holder, function (e) {
			main.action(e);
		});
	}, 1);

	Mx.component.register(main);
})();
