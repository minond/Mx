"use strict";

(function (self) {
	self.include.module.file;
	self.out.register("character_load", {
		title: "Loaded Character"
	});

	// Character is a constructor, not a module
	var main = self.module.constructor("Character");

	// possible states a character may have
	// new: character instance has been created, but not edited in any way
	// built: character instance has now be completly build
	// ready: character instance has been built and added to the viewport
	// selected: character instance has been selected by a user (mx_components/movenent)
	// acting: character instance is taking any type of action (mx_components/movenent)
	// dead: character instance has been removed from viewport (but not deleted)
	main.static.states = manage.enum("new", "build", "ready", "selected", "acting", "dead");

	// character counter
	var character_count = 0;

	// character holder
	var characters = {};

	// parse character data and build new character
	// constructor short-cut
	var register_character = function (name, data) {
		(function () {
			var loc_name = name;
			var loc_data = data;
			var loc_main = main;
			var loc_self = self;
			
			main.static[ loc_name ] = function (show, select) {
				loc_self.include.module.enviroment.placement;
				loc_self.include.module.enviroment.movement;

				var character = new loc_main.static;

				// get the character ready to be built
				character.set_height(loc_data.height);
				character.set_width(loc_data.width);
				character.set_color(loc_data.color);
				character.set_view_range(loc_data.view.horizontal, loc_data.view.vertical);

				// build it
				character.build();

				// and draw it's points
				mh(loc_data.points).for_each(function (i, point) {
					character.new_body_map(point.x || 0, point.y || 0, point.c || null);
				});

				if (show) {
					mx.enviroment.placement.place(character);

					if (select) {
						mx.enviroment.movement.select(character);
					}

					character.show();
				}

				// save the character
				loc_main.static.characters[ character.holder.id ] = character;

				// done
				return character;
			};
		})();
	};

	// character data importer helper function
	// mx_product/{project}/characters/{character}.json
	main.static.load = function () {
		var file_path, raw_data, data;
		
		mh(arguments).for_each(function (i, file) {
			file_path = stringf("mx_project/{%0}/characters/{%1}.json", mx.settings.project_name, file);
			raw_data = mx.file.read(filepath);

			if (raw_data) {
				data = eval("(" + raw_data + ")");
				register_character(file, data);
				mx.out.character_load(file);
			}
		});
	};

})(mx);
		
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

	
	main.prototype.view_area = 0;
	main.prototype.view_length_vertical = 0;
	main.prototype.view_length_horizontal = 0;
	main.prototype.view_range_bit = false;
	main.prototype.view_range = function (horizontal, vertical) {
		this.view_length_horizontal = horizontal;
		this.view_length_vertical = vertical;
		this.view_area = (this.raw_width + (horizontal * 2)) * (this.raw_height + (vertical * 2));
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
