/**
 * @name canvas module
 * @var Object
 */
mx.module.register("canvas", function (module, settings, self) {
	self.file.include.elem;

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
	 * @name create
	 * @param Integer height
	 * @param Integer width
	 * @param Boolean append to body
	 * @param Boolean use as default canvas element
	 * @return Object canvas element and 2d context
	 */
	module.create = function (height, width, append, use) {
		var elem = self.elem.create("canvas");

		if (height && width) {
			elem.height = height;
			elem.width = width;
		}

		if (append) {
			self.elem.append(elem);
		}

		if (use) {
			settings.el = elem;
			settings.context = elem.getContext("2d");
		}

		return {
			el: elem,
			context: elem.getContext("2d")
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
