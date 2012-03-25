"use strict";


// does now rely on element functions too much, but 
// does extend the element object.
mx.include.module.dependency.file;
mx.include.module.dependency.element;
mx.include.module.dependency.gravity;
mx.include.module.dependency.sound;

// acts as both the constructor of new players
// and as the module's scope.
mx.element.player = (function () {
	var main = function mx_player_instance () {};

	mx.sound.register("drop.mp3");

	// possible states a player may have
	// new:			player instance has been created, but not edited in any way
	// built:		player instance has now be completly build
	// ready:		player instance has been built and added to the viewport
	// selected:	player instance has been selected by a user (mx_components/movenent)
	// acting:		player instance is taking any type of action (mx_components/movenent)
	// dead:		player instance has been removed from viewport (but not deleted)
	var States = main.states = manage.enum(
		"new", 
		"built", 
		"ready", 
		"selected", 
		"acting", 
		"dead"
	);

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

	// static properties
	main.player_count = 0;
	main.players = {};
	main.holder = "holder";

	main.fn = function (name, value) {
		return main.prototype[ name ] = value;
	};

	// player data importer helper function
	// {project}/players/{player}.json
	main.get = function (file) {
		var filepath = Template.stringf("{%0}/players/{%1}.json", mx.__project__, file);
		var raw_data = mx.file.read(filepath);
		var json_data = raw_data && eval("(" + raw_data + ")");
		
		mx.out.resource({ name: file, type: "player" });
		player_register(file, json_data);

		mx.debug.log("imported player data: ", file, json_data);
	};

	// import a list of players
	main.gets = function (player_array) {
		for (var i = 0; i < player_array.length; i++) {
			main.get(player_array[i]);
		}
	};

	var player_register = function (player_name, player_data) {
		(function () {
			var loc_player_name = player_name;
			var loc_player_data = player_data;
			main[ loc_player_name ] = function (show) {
				var player = new mx.element.player;

				player.height(loc_player_data.height);
				player.width(loc_player_data.width);
				player.color(loc_player_data.color);
				player.build();

				for (var point = 0, max = loc_player_data.points.length; point < max; point++) {
					player.body_map(
						loc_player_data.points[ point ].x || 0,
						loc_player_data.points[ point ].y || 0,
						loc_player_data.points[ point ].c || null
					);
				}

				if (show === true) {
					player.show();
				}

				main.players[ player.holder.id ] = player;
				return player;
			};
		})();
	};

	// creates a new holder and sets any needed props
	var build_player_object = function () {
		this.holder = mx.element.block();
		this.holder.id = classes.id + main.player_count++;
		this.holder.className = classes.player;
		this._holder = null;
		mx.gravity.as_solid(this.holder);
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

	// height in pixels
	main.prototype._height;
	main.prototype._width;

	// height in normal numerical units
	// used to calculate placements
	main.prototype.raw_width;
	main.prototype.raw_height;

	// default color for nodes
	main.prototype._color;

	// holder is a div element holding all piece elements
	// that make up the player
	main.prototype.holder;

	// _holder is a div element in the enviroment that the 
	// top left hand corner of the holder element is attached to.
	main.prototype._holder;
	main.prototype.offset = [];

	// number of pieces that make up a player
	main.prototype.pieces = 0;

	// the player element's state
	// @see States
	main.prototype.state = States.new;

	// setter for color
	main.prototype.color = function (c) {
		return this._color = c;
	};

	// setter for height
	main.prototype.height = function (h) {
		if (h)
			this._height = h * units.height + ((h - 1) * units.height_offset);

		this.raw_height = h;
		apply_player_dimensions.call(this);
		return this._height;
	}

	// setter for width
	main.prototype.width = function (w) {
		if (w)
			this._width = w * units.width + ((w - 1) * units.width_offset);

		this.raw_width = w;
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
		var me = this;

		mx.queue.global(function () {
			mx.dom.vp.append(me.holder);
			mx.sound.play.drop;
			me.state = States.ready;
		});
	};

	// hide a players
	main.prototype.hide = function () {
		x(this.holder).hide();
	};

	// player body map appender
	main.prototype.body_map = function (left_offset, top_offset, piece_color) {
		var piece = mx.element.block();

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

	// for the gravity module
	main.prototype.gravity = { touching: {
		side_top: [],
		side_bottom: [],
		side_right: [],
		side_left: []
	} };

	return main;
})();
