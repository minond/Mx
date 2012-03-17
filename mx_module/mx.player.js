"use strict";


// does now rely on element functions too much, but 
// does extend the element object.
mx.include.module.dependency.element;
mx.include.module.dependency.file;

// acts as both the constructor of new players
// and as the module's scope.
mx.element.Player = (function () {
	var main = new Function;

	// static properties
	main.players = 0;

	var classes = main.classes = {
		player: "mx_player",
		body: "mx_player_body_part",
		id: "mx_player_"
	};

	var units = main.units = {
		unit: "px",
		height: 10,
		height_offset: 1,
		height_body: 2,
		width: 10,
		width_offset: 1,
		width_body: 2
	};

	// player data importer helper function
	// {project}/players/{player}.json
	main.player_import = function (file) {
		var filepath = Template.stringf("{%0}/players/{%1}.json", mx.__project__, file);
		var raw_data = mx.file.read(filepath);
		var json_data = raw_data && eval("(" + raw_data + ")");
		
		player_register(file, json_data);

		mx.debug.log("imported player data: ", file, json_data);
	};

	var player_register = function (player_name, player_data) {
		(function () {
			var loc_player_name = player_name;
			var loc_player_data = player_data;
			main[ loc_player_name ] = function () {
				var player = new mx.element.Player;

				player.color(loc_player_data.color);
				player.height(loc_player_data.height);
				player.width(loc_player_data.width);
				player.build();

				for (var point = 0, max = loc_player_data.points.length; point < max; point++) {
					player.body_map(
						loc_player_data.points[ point ].x || 0,
						loc_player_data.points[ point ].y || 0,
						loc_player_data.points[ point ].c || null
					);
				}

				return player;
			};
		})();
	};

	var player_block_template = function () {
		return document.createElement("div");
	};

	// creates a new holder and sets any needed props
	var build_player_object = function () {
		this.holder = player_block_template();
		this.holder.id = classes.id + main.players++;
		this.holder.className = classes.player;
	}

	// takes the player holder and sets required styles
	var apply_player_dimensions = function () {
		if (!this.holder)
			return false;

		if (this._height)
			x(this.holder).css({
				height: this._height + units.unit
			});

		if (this._width)
			x(this.holder).css({
				width: this._width + units.unit
			});
	};

	// player's property
	main.prototype._height;
	main.prototype._width;
	main.prototype._color;
	main.prototype.holder;
	main.prototype.pieces = 0;
	main.prototype.state = manage.enum("new", "built", "ready", "playing", "dead");

	// setter for color
	main.prototype.color = function (c) {
		return this._color = c;
	};

	// setter for height
	main.prototype.height = function (h) {
		if (h)
			this._height = h * units.height + ((h - 1) * units.height_offset);

		apply_player_dimensions.call(this);
		return this._height;
	}

	// setter for width
	main.prototype.width = function (w) {
		if (w)
			this._width = w * units.width + ((w - 1) * units.width_offset);

		apply_player_dimensions.call(this);
		return this._width;
	};

	// holder's contructor
	main.prototype.build = function () {
		build_player_object.call(this);
		apply_player_dimensions.call(this);
	};

	// displaye a player on the viewport
	main.prototype.show = function () {
		mx.queue.dom.append(this.holder);
	};

	// hide a players
	main.prototype.hide = function () {
		x(this.holder).hide();
	};

	// player body map appender
	main.prototype.body_map = function (left_offset, top_offset, piece_color) {
		var piece = player_block_template();

		x(piece).css({
			backgroundColor: piece_color || this._color,
			width: units.width_body + units.unit,
			height: units.height_body + units.unit,
			top: top_offset * units.height_body + units.unit,
			left: left_offset * units.width_body + units.unit
		});

		this.pieces++;
		piece.setAttribute("body_part", JSON.stringify([ top_offset, left_offset ]));
		piece.className = classes.body;
		this.holder.appendChild(piece);
	};

	// body map reset
	main.prototype.body_reset = function () {
		this.holder.innerHTML = "";
	};

	return main;
})();

/*
// for testing only
x(mx_output_holder).hide();

var pp_body_color = "#BDAEC6";
var pp_eyes_color = "#732C7B";

var pp = new mx.element.Player;
pp.height(2);
pp.width(3);
pp.color(pp_body_color);
pp.build();
pp.show();

// antennae
pp.body_map(0, 5);
pp.body_map(0, 9);

// legs
pp.body_map(9, 3);
pp.body_map(9, 4);
pp.body_map(9, 10);
pp.body_map(9, 11);

// left arm
pp.body_map(5, 1);
pp.body_map(5, 2);
pp.body_map(6, 1);
pp.body_map(6, 2);
pp.body_map(7, 1);

// right arm
pp.body_map(5, 12);
pp.body_map(5, 13);
pp.body_map(6, 12);
pp.body_map(6, 13);
pp.body_map(7, 13);

// eyes
pp.body_map(5, 5, pp_eyes_color);
pp.body_map(4, 5, pp_eyes_color);
pp.body_map(5, 4, pp_eyes_color);
pp.body_map(4, 4, pp_eyes_color);

pp.body_map(5, 9, pp_eyes_color);
pp.body_map(4, 9, pp_eyes_color);
pp.body_map(5, 10, pp_eyes_color);
pp.body_map(4, 10, pp_eyes_color);

// body
pp.body_map(8, 3);
pp.body_map(8, 4);
pp.body_map(8, 5);
pp.body_map(8, 6);
pp.body_map(8, 7);
pp.body_map(8, 8);
pp.body_map(8, 9);
pp.body_map(8, 10);
pp.body_map(8, 11);
pp.body_map(7, 3);
pp.body_map(7, 4);
pp.body_map(7, 5);
pp.body_map(7, 6);
pp.body_map(7, 7);
pp.body_map(7, 8);
pp.body_map(7, 9);
pp.body_map(7, 10);
pp.body_map(7, 11);
pp.body_map(6, 3);
pp.body_map(6, 4);
pp.body_map(6, 5);
pp.body_map(6, 6);
pp.body_map(6, 7);
pp.body_map(6, 8);
pp.body_map(6, 9);
pp.body_map(6, 10);
pp.body_map(6, 11);
pp.body_map(5, 3);
pp.body_map(5, 6);
pp.body_map(5, 7);
pp.body_map(5, 8);
pp.body_map(5, 11);
pp.body_map(4, 3);
pp.body_map(4, 6);
pp.body_map(4, 7);
pp.body_map(4, 8);
pp.body_map(4, 11);
pp.body_map(3, 3);
pp.body_map(3, 4);
pp.body_map(3, 5);
pp.body_map(3, 6);
pp.body_map(3, 7);
pp.body_map(3, 8);
pp.body_map(3, 9);
pp.body_map(3, 10);
pp.body_map(3, 11);
pp.body_map(2, 3);
pp.body_map(2, 4);
pp.body_map(2, 5);
pp.body_map(2, 6);
pp.body_map(2, 7);
pp.body_map(2, 8);
pp.body_map(2, 9);
pp.body_map(2, 10);
pp.body_map(2, 11);
pp.body_map(1, 3);
pp.body_map(1, 4);
pp.body_map(1, 5);
pp.body_map(1, 6);
pp.body_map(1, 7);
pp.body_map(1, 8);
pp.body_map(1, 9);
pp.body_map(1, 10);
pp.body_map(1, 11);*/
