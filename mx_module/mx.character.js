"use strict";


// does now rely on element functions too much, but 
// does extend the element object.
mx.include.module.dependency.file;
mx.include.module.dependency.element;
mx.include.module.dependency.gravity;
mx.include.module.dependency.sound;

// acts as both the constructor of new characters
// and as the module's scope.
mx.element.character = (function () {
	var main = function mx_character_instance () {};

	mx.sound.register("drop.mp3");

	// possible states a character may have
	// new:			character instance has been created, but not edited in any way
	// built:		character instance has now be completly build
	// ready:		character instance has been built and added to the viewport
	// selected:	character instance has been selected by a user (mx_components/movenent)
	// acting:		character instance is taking any type of action (mx_components/movenent)
	// dead:		character instance has been removed from viewport (but not deleted)
	var States = main.states = manage.enum(
		"new", 
		"built", 
		"ready", 
		"selected", 
		"acting", 
		"dead"
	);

	var classes = main.classes = {
		character: "mx_character",
		body: "mx_character_body_part",
		body_x: "mx_character_body_part_x",
		body_y: "mx_character_body_part_y",
		id: "mx_character_"
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
	main.character_count = 0;
	main.characters = {};
	main.holder = "holder";

	main.fn = function (name, value) {
		return main.prototype[ name ] = value;
	};

	// character data importer helper function
	// {project}/characters/{character}.json
	main.get = function (file) {
		var filepath = Template.stringf("{%0}/characters/{%1}.json", mx.__project__, file);
		var raw_data = mx.file.read(filepath);
		var json_data = raw_data && eval("(" + raw_data + ")");
		
		mx.out.resource({ name: file, type: "character" });
		character_register(file, json_data);

		mx.debug.log("imported character data: ", file, json_data);
	};

	// import a list of characters
	main.gets = function (character_array) {
		for (var i = 0; i < character_array.length; i++) {
			main.get(character_array[i]);
		}
	};

	var character_register = function (character_name, character_data) {
		(function () {
			var loc_character_name = character_name;
			var loc_character_data = character_data;
			main[ loc_character_name ] = function (show, select) {
				mx.include.module.dependency.placement;
				mx.include.module.dependency.movement;

				var character = new mx.element.character;

				character.height(loc_character_data.height);
				character.width(loc_character_data.width);
				character.color(loc_character_data.color);
				character.build();

				for (var point = 0, max = loc_character_data.points.length; point < max; point++) {
					character.body_map(
						loc_character_data.points[ point ].x || 0,
						loc_character_data.points[ point ].y || 0,
						loc_character_data.points[ point ].c || null
					);
				}

				if (show) {
					character.show();
					mx.placement.place(character);

					if (select)
						mx.movement.select(character);
				}

				main.characters[ character.holder.id ] = character;
				return character;
			};
		})();
	};

	// creates a new holder and sets any needed props
	var build_character_object = function () {
		this.holder = mx.element.block();
		this.holder.id = classes.id + main.character_count++;
		this.holder.className = classes.character;
		this._holder = null;
		mx.gravity.as_solid(this.holder);
	}

	// takes the character holder and sets required styles
	var apply_character_dimensions = function () {
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
	// that make up the character
	main.prototype.holder;

	// _holder is a div element in the enviroment that the 
	// top left hand corner of the holder element is attached to.
	main.prototype._holder;
	main.prototype.offset = [];

	// number of pieces that make up a character
	main.prototype.pieces = 0;

	// the character element's state
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
		apply_character_dimensions.call(this);
		return this._height;
	}

	// setter for width
	main.prototype.width = function (w) {
		if (w)
			this._width = w * units.width + ((w - 1) * units.width_offset);

		this.raw_width = w;
		apply_character_dimensions.call(this);
		return this._width;
	};

	// holder's contructor
	main.prototype.build = function () {
		build_character_object.call(this);
		apply_character_dimensions.call(this);
		this.state = States.built;
	};

	// displaye a character on the viewport
	main.prototype.show = function () {
		var me = this;

		mx.queue.global(function () {
			mx.dom.vp.append(me.holder);
			mx.sound.play.drop;
			me.state = States.ready;
			x(me.holder).show();
		});
	};

	// hide a characters
	main.prototype.hide = function () {
		x(this.holder).hide();
	};

	// character body map appender
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
