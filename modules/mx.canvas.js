/**
 * @name canvas module
 * @var Object
 */
mx.module.register("canvas", function (module, settings, self) {
	self.file.include.elem;
	self.file.include.events;

	/**
	 * @name listener
	 * @var Object
	 */
	var listener = {};

	/**
	 * @name el
	 * @var Node
	 */
	settings.el;

	/**
	 * @name context
	 * @var CanvasRenderingContext2D
	 */
	settings.context;

	/**
	 * @name type
	 * @var String
	 * 
	 * type of context canvas should work under
	 */
	settings.type = "2d";

	/**
	 * @name click
	 * @param Event
	 * @return void
	 */
	listener.click = function (ev) {
		
	};

	/**
	 * @name keydown
	 * @param Events
	 * @return void
	 */
	listener.keydown = function (ev) {
		
	};

	/**
	 * @name bind_all
	 * @return void
	 */
	module.bind_all = function () {
		self.events.listen("click", listener.click);
		self.events.listen("keydown", listener.keydown);
	};

	/**
	 * @name create
	 * @param Integer height
	 * @param Integer width
	 * @param Boolean append to body
	 * @param Boolean use as default canvas element
	 * @return Object canvas element and 2d context
	 */
	module.create = function (height, width, append, use) {
		var elem = self.elem.create("canvas");
		var conx = elem.getContext(settings.type);

		if (height && width) {
			elem.height = height;
			elem.width = width;
		}

		if (append) {
			self.elem.append(elem);
		}

		if (use) {
			settings.el = elem;
			settings.context = conx
		}

		return {
			el: elem,
			context: conx
		};
	};

	/**
	 * @name draw
	 * @var Object
	 */
	module.draw = {};

	/**
	 * @name register
	 * @param String method name
	 * @param Function method
	 */
	module.register = function (name, action) {
		module.draw[ name ] = function (args) {
			if (settings.context) {
				action.apply(settings.context, self.util.to_array(arguments));
			}
		};
	};

	/**
	 * @name img
	 * @param mixed String/Node
	 * @return Promise
	 */
	module.register("img", function (src, x, y) {
		var node, promise, loc_this;

		if (self.util.is.node(src)) {
			node = src;
		}
		else {
			node = self.elem.create("img");
			node.src = src;
		}

		loc_this = this;
		promise = new self.util.Promise;

		node.addEventListener("load", function () {
			loc_this.drawImage(this, x, y);
		});
	});
});
