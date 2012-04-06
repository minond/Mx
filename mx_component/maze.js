// http://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
// http://weblog.jamisbuck.org/2011/2/7/maze-generation-algorithm-recap

(function () {
	mx.out.register("maze", "maze component");

	var main = { name: "maze" };

	var WALL = "w";
	var BLANK = "b";
	var EOL = "\n";

	var NORTH = 1;
	var SOUTH = 2;
	var EAST = 4;
	var WEST = 8;
	var UP = 16;
	var DOWN = 32;

	var DX = {
		1: 0,
		2: 0,
		4: 1,
		8: -1,
		16: 0,
		32: 0
	};

	var DY = {
		1: -1,
		2: 1,
		4: 0,
		8: 0,
		16: 0,
		32: 0
	};

	var DZ = {
		1: 0,
		2: 0,
		4: 0,
		8: 0,
		16: 1,
		32: -1
	};

	var OPPOSITE = {
		1: 2,
		2: 1,
		4: 8,
		8: 4,
		16: 32,
		32: 16
	};

	var LIST = [1, 2, 4, 8, 16, 32];

	var map_string = "";
	var map_grid = [];
	var map_array = [ [] ];

	main.display = function (maze_string) {
		if (!maze_string)
			return false;

		mx.queue.global(function () {
			var rows = maze_string.split(EOL), columns;
			var timer = new mx.debug.Timer;
			var SEP = "-";

			var left_offset = Math.floor((mx.dom.enviroment_dimensions.columns - rows[0].split("").length) / 2);
			var top_offset = Math.floor( 
					(x(mx.element.gcs(mx.dom.viewport, "height")).px2num() / mx.dom.defaults.node_size) / 2) 
					- Math.floor(rows.length / 2);
			
			if (!left_offset)
				left_offset = 0;
			if (!top_offset)
				top_offset = 0;

			var maze_coors = {
				height: rows.length,
				width: rows[0].split("").length,
				top_offset: top_offset,
				left_offset: left_offset
			};

			var maze_element = {
				backgroundColor: mx.element.color_map.gray
			};

			var top_maze_elems = mx.storage.select.element(mSQL.QUERY.all, function () {
				var in_column = this.offset[0] >= maze_coors.left_offset && 
					this.offset[0] < maze_coors.left_offset + maze_coors.width;

				var in_row = this.offset[1] < maze_coors.top_offset;

				return in_column && in_row;
			});

			var bottom_maze_elems = mx.storage.select.element(mSQL.QUERY.all, function () {
				var in_column = this.offset[0] >= maze_coors.left_offset && 
					this.offset[0] < maze_coors.left_offset + maze_coors.width;

				var in_row = this.offset[1] >= maze_coors.top_offset + maze_coors.height;

				return in_column && in_row;
			});
			

			// maze nodes
			var maze_elems = mx.storage.select.element(mSQL.QUERY.all, function () {
				var in_column = this.offset[0] >= maze_coors.left_offset && 
					this.offset[0] < maze_coors.left_offset + maze_coors.width;

				var in_row = this.offset[1] >= maze_coors.top_offset &&
					this.offset[1] < maze_coors.top_offset + maze_coors.height;

				return in_column && in_row;
			}, maze_coors.height * maze_coors.width);

			// maze node storage
			mx.storage.db.maze = { "@data": maze_elems };


			// top and bottom filler elements on the maze
			x(top_maze_elems).css(maze_element);
			x(top_maze_elems.length).times(function (i) {
				mx.storage.select.element.get(top_maze_elems[i].node).type = mx.element.type.BUILDING;
			});


			// for the row update queue
			var wall_count = maze_string.match(RegExp(WALL, "g")).length;
			var wall_points = [];

			for (var row = 0; row < rows.length; row++) {
				columns = rows[ row ].split("");
				for (var column = 0; column < columns.length; column++) {
					if (columns[ column ] === WALL) {
						wall_points.push([column, row]);
					}
				}
			}



			var raw_maze_elements = {};
			x(maze_elems.length).times(function (i) {
				raw_maze_elements[ maze_elems[i].offset.join(SEP) ] = maze_elems[i];
			});

			x(wall_points.length).times(function (i) {
				var point = [ wall_points[i][0] + left_offset, wall_points[i][1] + top_offset ];
				x(raw_maze_elements[ point.join(SEP) ].node).css(maze_element);
				raw_maze_elements[ point.join(SEP) ].type = mx.element.type.BUILDING;
			});

			// top and bottom filler elements on the maze
			x(bottom_maze_elems).css(maze_element);
			x(bottom_maze_elems.length).times(function (i) {
				mx.storage.select.element.get(bottom_maze_elems[i].node).type = mx.element.type.BUILDING;
			});


			mx.out.maze("displaying maze (" + timer() + "ms)");
		});
	};

	main.generate = function (width, height) {
		var h_check = height * 2 * 3;
		var w_check = width * 6 + 3;

		// size check
		if (mx.dom.enviroment_dimensions.rows < h_check || mx.dom.enviroment_dimensions.columns < w_check) {
			mx.out.maze("dimension error");
			return "";
		}

		map_grid = [];
		map_array = [[]];

		var timer = new mx.debug.Timer;

		var carved, cell, cells, dir, index, nx, ny, nz, x, y, z, _i, _len, _ref;
		var className, eastClass, southClass, x, y, z, _ref, _ref2, _ref3, _ref4;
		var depth = 1;

		map_grid = (function() {
			var _ref, _results = [];
			for (z = 1, _ref = depth; 1 <= _ref ? z <= _ref : z >= _ref; 1 <= _ref ? z++ : z--) {
				_results.push((function() {
					var _ref2, _results2 = [];

					for (y = 1, _ref2 = height; 1 <= _ref2 ? y <= _ref2 : y >= _ref2; 1 <= _ref2 ? y++ : y--) {
						_results2.push((function() {
							var _ref3, _results3;
							_results3 = [];

							for (x = 1, _ref3 = width; 1 <= _ref3 ? x <= _ref3 : x >= _ref3; 1 <= _ref3 ? x++ : x--) {
								_results3.push(0);
							}

							return _results3;
						})());
					}

					return _results2;
				})());
			}

			return _results;
		})();

		var cells = [{
			x: rand(width),
			y: rand(height),
			z: rand(depth)
		}];

		while (cells.length > 0) {
			index = rand(2) === 0 ? rand(cells.length) : cells.length - 1;
			cell = cells[index];
			carved = false;
			_ref = random_directions();
			
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				dir = _ref[_i];
				nx = cell.x + DX[dir];
				ny = cell.y + DY[dir];
				nz = cell.z + DZ[dir];

				if (nx >= 0 && ny >= 0 && nz >= 0 && nx < width && ny < height && nz < depth && map_grid[nz][ny][nx] === 0) {
					map_grid[cell.z][cell.y][cell.x] |= dir;
					map_grid[nz][ny][nx] |= OPPOSITE[dir];

					cells.push({
						x: nx,
						y: ny,
						z: nz
					});

					carved = true;
					break;
				}
			}

			if (!carved) {
				cells.splice(index, 1);
			}
		}

		map_grid[0][0][0] |= WEST;
		map_grid[depth - 1][height - 1][width - 1] |= EAST;

		for (z = 0, _ref = depth; 0 <= _ref ? z < _ref : z > _ref; 0 <= _ref ? z++ : z--) {
			for (x = 0, _ref2 = width * 2 + 1; 0 <= _ref2 ? x < _ref2 : x > _ref2; 0 <= _ref2 ? x++ : x--) {
				map_array[0][x] = WALL;
			}

			for (y = 0, _ref3 = height; 0 <= _ref3 ? y < _ref3 : y > _ref3; 0 <= _ref3 ? y++ : y--) {
				className = is_west(0, y, z) ? BLANK : WALL;
					
				if (!map_array[y+1])
					map_array[y+1] = [];
				if (!map_array[y+2])
					map_array[y+2] = [];

				map_array[y+1].push(className);
				map_array[y+2].push(WALL);

				for (x = 0, _ref4 = width; 0 <= _ref4 ? x < _ref4 : x > _ref4; 0 <= _ref4 ? x++ : x--) {
					eastClass = is_east(x, y, z) ? BLANK : WALL;
					southClass = is_south(x, y, z) ? BLANK : WALL;

					map_array[y+1].push(BLANK);
					map_array[y+1].push(eastClass);
					map_array[y+2].push(southClass);
					map_array[y+2].push(WALL);
				}
			}
		}


		var map_string = "";
		var map_string_row = "";
		var map_string_column = "";

		for (var row = 0; row < map_array.length; row++) {
			map_string_row = "";

			for (var column = 0; column < map_array[ row ].length; column++) {
				map_string_column = "";
				map_string_column += map_array[ row ][ column ];

				map_string_row += map_string_column;
				map_string_row += map_string_column;
				map_string_row += map_string_column;
	
				if (column === width * 2 && column + 1 !== map_array[ row ].length)
					map_string_row += EOL;
			}

			map_string += map_string_row + EOL;
		}
	
		map_string = map_string.substr(0, map_string.length - 1);
		map_string_row = map_string.split(EOL);
		map_string = [];

		for (var i = 0; i < map_string_row.length; i++) {
			map_string.push(map_string_row[ i ]);
			map_string.push(map_string_row[ i ]);
			map_string.push(map_string_row[ i ]);
		}

		map_string = map_string.join(EOL);
		mx.out.maze("generating maze (" + timer() + "ms)");

		return map_string;
	}

	var is_south = function(x, y, z) {
		return (map_grid[z][y][x] & SOUTH) === SOUTH;
	};

	var is_east = function(x, y, z) {
		return (map_grid[z][y][x] & EAST) === EAST;
	};

	var is_west = function(x, y, z) {
		return (map_grid[z][y][x] & WEST) === WEST;
	};

	var rand = function(n) {
		return Math.floor(Math.random() * n);
	};

	var random_directions = function() {
		var list = LIST.slice(0);
		var i = list.length - 1;
		var j, ref;

		while (i > 0) {
			j = rand(i + 1);

			ref = [list[j], list[i]];
			list[i] = ref[0];
			list[j] = ref[1];

			i--;
		}

		return list;
	};


	mx.components.register(main);
})();
