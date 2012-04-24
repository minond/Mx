"use strict";

(function (self) {
	self.include.module.dom;
	self.include.module.out;
	self.include.module.file;
	self.include.module.sound;
	self.include.module.enviroment.element;

	// when a character is displayed a "drop" sound is played
	self.sound.register("drop.mp3");

	self.out.register("character_load", {
		title: "Loaded Character"
	});

	// Character is a constructor, not a module
	var main = self.module.constructor("Character");

	// settings property
	main.static.settings = {
		classes: {
			char_id: "character_{%0}",
			char_class: "character_holder",
			piece_class: "character_piece"
		}
	};

	// possible states a character may have
	// 1. new: character instance has been created, but not edited in any way
	// 2. built: character instance has now be completly build
	// 3. ready: character instance has been built and added to the viewport
	// 4. selected: character instance has been selected by a user (mx_components/movenent)
	// 5. acting: character instance is taking any type of action (mx_components/movenent)
	// 6. dead: character instance has been removed from viewport (but not deleted)
	main.static.states = manage.enum("new", "build", "ready", "selected", "acting", "dead");

	// character counter
	var character_count = 0;

	// character holder
	main.static.characters = {};

	// parse character data and build new character
	// constructor short-cut
	var register_character = function (name, data) {
		(function () {
			var loc_name = name;
			var loc_data = data;
			var loc_main = main;
			var loc_self = self;
			
			main.static[ loc_name ] = function (show, select, move_to) {
				loc_self.include.module.enviroment.placement;
				loc_self.include.module.enviroment.movement;

				var character = new loc_main.static;

				// get the character ready to be built
				character.set_height(loc_data.height);
				character.set_width(loc_data.width);
				character.set_color(loc_data.color);
				character.set_block_size(loc_data.block_size);

				// build it
				character.build();

				// and draw it's points
				mh.for_each(loc_data.points, function (i, point) {
					character.new_body_map(
						point.x || 0,
						point.y || 0,
						point.c || null
					);
				});

				if (show) {
					if (move_to) {
						self.enviroment.placement.place(character, move_to);
					}
					else {
						self.enviroment.placement.place(character, [0, 0]);
					}

					if (select) {
						self.enviroment.movement.select(character);
					}

					character.show();
				}

				if ("normalization" in loc_data) {
					character.normalize({
						top: loc_data.normalization.top || 0,
						right: loc_data.normalization.right || 0,
						bottom: loc_data.normalization.bottom || 0,
						left: loc_data.normalization.left || 0
					});
				}

				// save the character
				loc_main.static.characters[ character.holder.id ] = character;

				// done
				return character;
			};
		})();
	};

	// mx_character/{character}.json
	main.static.directory = "mx_characters/{%0}.json";

	// character data importer helper function
	main.static.load = function () {
		var file_path, raw_data, data;
		
		mh.for_each(mtype(arguments[0]).is_array ? arguments[0] : arguments, function (i, file) {
			file_path = stringf(main.static.directory, file);
			raw_data = self.file.read(file_path);

			if (raw_data) {
				data = eval("(" + raw_data + ")");
				self.out.character_load(file);
				register_character(file, data);
			}
		});
	};

	// prototype properties
	main.public.offset = [];
	main.public.holder = null;
	main.public.height = 0;
	main.public.width = 0;
	main.public.block_size = 0;
	main.public.color = self.enviroment.element.color_map.salmon;

	// character state
	main.public.state = main.static.states.new;

	// prototype methods
	main.public.build = function () {
		// creates a new holder and sets any needed props
		this.holder = self.enviroment.element.block();
		this.holder.id = stringf(main.static.settings.classes.char_id, character_count++);
		this.holder.className = main.static.settings.classes.char_class;
		// self.enviroment.gravitiy.as_solid(this);

		// takes the character holder and sets required styles
		mh.css(this.holder, {
			height: mh.num2px(this.height * self.dom.settings.enviromentport.node_size.height),
			width: mh.num2px(this.width * self.dom.settings.enviromentport.node_size.width),
		});

		// update the instance's state
		this.state = main.static.states.built;
	};

	// color setter
	main.public.set_color = function (color) {
		this.color = color;
		return this;
	};

	// block size setter
	main.public.set_block_size = function (size) {
		this.block_size = size;
		return this;
	};

	// height setter
	main.public.set_height = function (height) {
		this.height = height;
		return this;
	};

	// width setter
	main.public.set_width = function (width) {
		this.width = width;
		return this;
	};

	// display the holder
	main.public.show = function () {
		var character = this;

		self.stack.global(function () {
			self.dom.append(character.holder);
			mh.show(character.holder);
			character.state = main.static.states.ready;
		});
	};

	// hide the holder
	main.public.hide = function () {
		mh.hide(this.holder);
		this.state = main.static.states.dead;
	};

	// character body map appender
	// adds a point to the character's body
	main.public.new_body_map = function (left, top, color) {
		var piece = self.enviroment.element.block();
		var block = this.block_size !== 1 ? this.block_size - 1 : 1;

		mh.css(piece, {
			backgroundColor: color || this.color,
			left: mh.num2px(left * block),
			top: mh.num2px(top * block)
		});

		mh.attr(piece, {
			x: left,
			y: top
		});

		piece.className = main.static.settings.classes.piece_class;
		this.holder.appendChild(piece);
	};

	// clears a character's body pieces
	main.public.reset_body_map = function () {
		this.holder.innerHTML = "";
	};

	// offset fixer
	main.public.normalize = function (obj) {
		var me = this;
		var current;

		this.normalization = obj;

		mh.for_each(obj, function (offset, amount) {
			mh.for_each(me.holder.childNodes, function (i, node) {
				if (node && node.style) {
					current = mh.px2num(node.style[ offset ]);
					node.style[ offset ] = mh.num2px( current + amount );
				}
			});
		});
	};

	// returns a character's holder node
	main.static.get_holder = function (elem) {
		if (mtype(elem).is_character)
			return elem.holder;
	};
})(mx);
