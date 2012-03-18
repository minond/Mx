"use strict";


// does now rely on element functions too much, but 
// does extend the element object.
mx.include.module.dependency.element;
mx.include.module.dependency.file;

// acts as both the constructor of new players
// and as the module's scope.
mx.element.player = (function () {
	var main = function mx_player_instance () {};

	// static properties
	main.players = 0;

	var classes = main.classes = {
		player: "mx_player",
		body: "mx_player_body_part",
		body_x: "mx_player_body_part_x",
		body_y: "mx_player_body_part_y",
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
	main.get = function (file) {
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
				var player = new mx.element.player;

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

	// possible states a player may have
	// new:			player instance has been created, but not edited in any way
	// built:		player instance has now be completly build
	// ready:		player instance has been built and added to the viewport
	// selected:	player instance has been selected by a user (mx_components/movenent)
	// acting:		player instance is taking any type of action (mx_components/movenent)
	// dead:		player instance has been removed from viewport (but not deleted)
	var States = main.states = manage.enum("new", "built", "ready", "selected", "acting", "dead");

	// player's property
	main.prototype._height;
	main.prototype._width;
	main.prototype._color;
	main.prototype.holder;
	main.prototype.pieces = 0;
	main.prototype.state = States.new;

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
		this.state = States.built;
	};

	// displaye a player on the viewport
	main.prototype.show = function () {
		mx.queue.dom.append(this.holder);
		this.state = States.ready;
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
		piece.setAttribute(classes.body_x, top_offset);
		piece.setAttribute(classes.body_y, left_offset);
		piece.className = classes.body;
		this.holder.appendChild(piece);
	};

	// body map reset
	main.prototype.body_reset = function () {
		this.holder.innerHTML = "";
	};

	return main;
})();
